import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { setTimeout as delay } from 'node:timers/promises'
import { chromium } from 'playwright'

const port = 4177
const path = '/ai-engineering-talk/pr-preview/pr-10/order-api/'
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

const functionalCases = [
  { name: 'default-page', query: '', total: 42, ids: [42, 35, 28, 21, 14] },
  { name: 'first-page', query: '?pageSize=3', total: 42, ids: [42, 35, 28] },
  { name: 'second-page', query: '?page=1&pageSize=3', total: 42, ids: [21, 14, 7] },
  { name: 'utc-day', query: '?fromDate=2026-01-01&toDate=2026-01-01', total: 6, ids: [36, 29, 22, 15, 8, 1] },
  { name: 'paid-utc-day', query: '?status=PAID&fromDate=2026-01-01&toDate=2026-01-01', total: 2, ids: [29, 8] },
  { name: 'status-only', query: '?status=MISSING', total: 0, ids: [] },
  { name: 'beyond-last-page', query: '?page=100&pageSize=3', total: 42, ids: [] },
  { name: 'maximum-page-size', query: '?pageSize=100', total: 42, count: 42, ids: [42, 35, 28, 21, 14] },
]

const invalidCases = [
  { name: 'negative-page', query: '?page=-1' },
  { name: 'non-numeric-page', query: '?page=abc' },
  { name: 'zero-page-size', query: '?pageSize=0' },
  { name: 'oversized-page-size', query: '?pageSize=101' },
  { name: 'missing-toDate', query: '?fromDate=2026-01-01' },
  { name: 'missing-fromDate', query: '?toDate=2026-01-01' },
  { name: 'invalid-calendar-day', query: '?fromDate=2026-02-30&toDate=2026-03-01' },
  { name: 'reverse-date-interval', query: '?fromDate=2026-01-03&toDate=2026-01-01' },
  { name: 'unsafe-pagination-offset', query: '?page=9007199254740991&pageSize=100' },
]

const rejectedSql = [
  { sql: 'DELETE FROM orders', params: [], method: 'all' },
  { sql: 'SELECT * FROM orders', params: [], method: 'all' },
  { sql: 'SELECT count(*) AS wrong FROM orders', params: [], method: 'all' },
  { sql: 'SELECT count(*) FROM orders WHERE status = ?', params: [], method: 'all' },
  { sql: 'SELECT count(*) FROM orders WHERE status = ?', params: [10], method: 'all' },
  { sql: 'SELECT count(*) FROM orders WHERE (status = ?', params: ['PAID'], method: 'all' },
  { sql: 'SELECT count(*) FROM orders WHERE status = ?)', params: ['PAID'], method: 'all' },
  { sql: 'SELECT count(*) FROM orders WHERE ()status = ?', params: ['PAID'], method: 'all' },
  { sql: 'SELECT count(*) FROM orders WHERE status = ? OR created_at < ?', params: ['PAID', '2026-01-02T00:00:00.000Z'], method: 'all' },
  { sql: 'SELECT id, customer_id, status, created_at FROM orders ORDER BY id ASC LIMIT ?', params: [3], method: 'all' },
  { sql: 'SELECT id, customer_id, status, created_at FROM orders ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?', params: [3, -1], method: 'all' },
  { sql: 'SELECT count(*) FROM orders', params: [], method: 'unknown' },
  { sql: 5, params: [], method: 'all' },
  { sql: 'SELECT count(*) FROM orders', params: 'not-array', method: 'all' },
]

test('Gate B: browser MSW contract, bounded DB, query matrix and reproducible evidence', { timeout: 150000 }, async () => {
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

    const evidence = []
    for (const c of functionalCases) {
      const result = await page.evaluate(query => window.__runComparison(query), c.query)
      for (const variant of ['ai', 'convention']) {
        const response = result[variant]
        assert.equal(response.status, 200, c.name + '/' + variant + ': ' + JSON.stringify(response))
        assert.equal(response.body.code, 'OK')
        assert.equal(response.body.message, 'm0000')
        const normalized = response.body.data
        assert.equal(normalized.totalCount, c.total, c.name + '/' + variant)
        assert.deepEqual(normalized.items.slice(0, c.ids.length).map(x => x.id), c.ids, c.name + '/' + variant)
        if (c.count !== undefined) assert.equal(normalized.items.length, c.count, c.name)
      }
      assert.deepEqual(result.ai.body, result.convention.body, c.name + ': identical success contract and data')
      assert.equal(result.ai.consumed.totalCount, c.total, c.name + ': AI-direct consumer')
      assert.equal(result.convention.consumed.totalCount, c.total, c.name + ': convention consumer')
      assert.match(result.ai.consumer, /^compatible:/, c.name)
      assert.match(result.convention.consumer, /^compatible:/, c.name)
      assert.equal(result.trace.filter(x => x.stage === 'API').length, 2, c.name)
      assert.equal(result.trace.filter(x => x.stage === 'DB').length, 4, c.name)
      for (const command of result.trace.filter(x => x.stage === 'DB')) {
        assert.ok(['all', 'objects'].includes(command.method), c.name + ': query method present')
        assert.ok(Array.isArray(command.params), c.name + ': SQL bindings captured')
      }
      assert.equal(result.provenance, 'Chromium / MSW browser worker / bounded SQL evaluator (no real database)')
      assert.ok(result.sourceRevision)
      evidence.push({ name: c.name, expectedStatus: 200, ...result })
    }

    for (const c of invalidCases) {
      const result = await page.evaluate(query => window.__runComparison(query), c.query)
      assert.equal(result.ai.status, 400, c.name)
      assert.equal(result.convention.status, 400, c.name)
      assert.equal(result.ai.body.code, 'INVALID_QUERY', c.name)
      assert.equal(result.convention.body.code, 'INVALID_QUERY', c.name)
      assert.equal(result.ai.body.data, null, c.name)
      assert.equal(result.convention.body.data, null, c.name)
      assert.equal(typeof result.ai.body.message, 'string')
      assert.notEqual(result.ai.body.message, 'm0001', c.name + ': AI-direct uses readable detail')
      assert.equal(result.convention.body.message, 'm0001', c.name + ': convention uses catalog code')
      assert.equal(result.trace.filter(x => x.stage === 'DB').length, 0, c.name + ': no DB calls')
      assert.equal(result.ai.consumed, null, c.name + ': old front end cannot resolve raw text')
      assert.match(result.ai.consumer, /^incompatible: Unknown message code:/)
      assert.equal(result.convention.consumed.displayMessage, '查詢條件不合法', c.name)
      assert.match(result.convention.consumer, /^compatible: message code resolved/)
      evidence.push({ name: c.name, expectedStatus: 400, ...result })
    }

    const auxiliary = await page.evaluate(async () => {
      const base = window.location.href
      const read = async (variant, resource) => {
        const response = await fetch(new URL('mock/api/' + variant + '/' + resource, base))
        return { status: response.status, body: await response.json() }
      }
      return {
        status: [await read('ai-direct', 'status'), await read('project-convention', 'status')],
        notFound: [await read('ai-direct', 'missing'), await read('project-convention', 'missing')],
      }
    })
    for (const result of auxiliary.status) {
      assert.equal(result.status, 200)
      assert.equal(result.body.message, 'm0000')
    }
    for (const result of auxiliary.notFound) {
      assert.equal(result.status, 404)
      assert.equal(result.body.code, 'NOT_FOUND')
    }
    assert.equal(auxiliary.notFound[0].body.message, 'Not found')
    assert.equal(auxiliary.notFound[1].body.message, 'm0002')

    for (const command of rejectedSql) {
      const reply = await page.evaluate(query => window.__probeSql(query), command)
      assert.equal(reply.status, 422, 'unsupported SQL must fail closed: ' + JSON.stringify(command))
      assert.ok(reply.body.error, 'rejection explains invalid command')
    }

    await page.reload()
    await page.waitForFunction(() => window.__mockReady === true, { timeout: 40000 })
    const afterReload = await page.evaluate(() => window.__runComparison('?pageSize=3'))
    assert.equal(afterReload.convention.body.data.totalCount, 42)
    assert.deepEqual(errors, [])

    const outDir = new URL('../generated/', import.meta.url)
    await mkdir(outDir, { recursive: true })
    const report = {
      schemaVersion: 1,
      sourceRevision: evidence[0].sourceRevision,
      provenance: 'Real Chromium; static Vite preview at Pages-like subpath; MSW API + MSW DB, bounded SQL evaluator; not SQLite',
      location: path,
      functionalityCases: functionalCases.length,
      invalidInputCases: invalidCases.length,
      rejectedSqlCases: rejectedSql.length,
      cases: evidence,
    }
    await writeFile(new URL('browser-evidence.json', outDir), JSON.stringify(report, null, 2) + '\n')
    process.stdout.write('Browser evidence: ' + functionalCases.length + ' success cases, '
      + invalidCases.length + ' input rejects, ' + rejectedSql.length
      + ' unsupported SQL rejects. Saved generated/browser-evidence.json\n')
    await context.close()
  } finally {
    await browser?.close()
    proc.kill('SIGTERM')
    await delay(300)
    if (proc.exitCode !== null && proc.exitCode !== 0) process.stderr.write(serverLogs)
  }
})
