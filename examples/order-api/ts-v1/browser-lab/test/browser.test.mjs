import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { setTimeout as delay } from 'node:timers/promises'
import { chromium } from 'playwright'

const port = 4177
const path = '/ai-engineering-talk/pr-preview/pr-10/browser-lab/'
const origin = 'http://127.0.0.1:' + port
const address = origin + path

async function untilReady() {
  for (let i = 0; i < 80; i++) {
    try {
      if ((await fetch(address)).ok) return
    } catch {}
    await delay(250)
  }
  throw new Error('Vite preview did not start')
}

test('static subpath: nested API MSW → real Drizzle/SQL → DB MSW → consumer', { timeout: 150000 }, async () => {
  const proc = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
    cwd: new URL('../', import.meta.url),
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  let serverLogs = ''
  for (const stream of [proc.stdout, proc.stderr]) stream.on('data', d => { serverLogs += String(d) })
  let browser
  try {
    await untilReady()
    browser = await chromium.launch({ headless: true })
    const context = await browser.newContext({ serviceWorkers: 'allow' })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', err => errors.push(String(err)))
    await page.goto(address)
    await page.waitForFunction(() => window.__mockReady === true, { timeout: 40000 })
    assert.equal(await page.evaluate(() => Boolean(navigator.serviceWorker.controller)), true)

    const result = await page.evaluate(() => window.__runComparison('?pageSize=3'))
    assert.equal(result.ai.status, 200)
    assert.equal(result.convention.status, 200)
    assert.equal(result.ai.body.totalCount, 42)
    assert.equal(result.convention.body.data.totalCount, 42)
    assert.deepEqual(result.ai.body.data.map(x => x.id), [42, 35, 28])
    assert.deepEqual(result.convention.body.data.items, result.ai.body.data)
    assert.match(result.ai.consumer, /incompatible/)
    assert.match(result.convention.consumer, /compatible/)
    assert.equal(result.trace.filter(x => x.stage === 'API').length, 2)
    assert.equal(result.trace.filter(x => x.stage === 'DB').length, 4)
    assert.ok(result.trace.some(x => x.detail.toLowerCase().includes('select count(')))

    const filtered = await page.evaluate(() => window.__runComparison(
      '?status=PAID&fromDate=2026-01-01&toDate=2026-01-01'))
    assert.deepEqual(filtered.ai.body.data.map(x => x.id), [29, 8])
    assert.deepEqual(filtered.convention.body.data.items, filtered.ai.body.data)

    const bad = await page.evaluate(() => window.__runComparison('?page=-1'))
    assert.equal(bad.ai.status, 400)
    assert.equal(bad.convention.status, 400)
    assert.equal(bad.trace.filter(x => x.stage === 'DB').length, 0)
    assert.equal(await page.evaluate(() => window.__rejectSql()), 422)

    await page.reload()
    await page.waitForFunction(() => window.__mockReady === true, { timeout: 40000 })
    const afterReload = await page.evaluate(() => window.__runComparison('?pageSize=3'))
    assert.equal(afterReload.convention.body.data.totalCount, 42)
    assert.deepEqual(errors, [])
    await context.close()
  } finally {
    await browser?.close()
    proc.kill('SIGTERM')
    await delay(300)
    if (proc.exitCode !== null && proc.exitCode !== 0 && proc.signalCode !== 'SIGTERM') {
      throw new Error('Vite preview failed: ' + serverLogs)
    }
  }
})
