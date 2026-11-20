import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'

const args = process.argv.slice(2)
const option = args.indexOf('--base-url')
const baseUrl = option < 0 ? 'http://127.0.0.1:4173/' : args[option + 1]
if (!baseUrl.endsWith('/')) throw new Error('base URL must end in /')
const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  viewport: { width: 1600, height: 900 },
  serviceWorkers: 'allow',
})
const page = await context.newPage()
const errors = []
const report = { baseUrl, cases: [], errors }
page.on('pageerror', error => {
  if (!error.message.includes('Wake Lock permission request denied')) errors.push(error.message)
})
async function open(slide) {
  await page.goto(baseUrl + '#/' + slide + '?clicks=0', { waitUntil: 'domcontentloaded' })
  await page.locator('.slidev-page[data-slidev-no="' + slide + '"]').waitFor({ state: 'visible' })
}
try {
  await open(3)
  await page.locator('[data-testid="status-ai-direct"]').waitFor({ timeout: 30000 })
  assert.equal((await page.locator('[data-testid="status-ai-direct"]').textContent()).trim(), '200 OK')
  assert.equal(await page.locator('.live-stats strong').textContent(), '42')
  assert.equal(await page.evaluate(() => Boolean(navigator.serviceWorker.controller)), true)
  report.cases.push('slide 3: real MSW API 200 / worker controls document')

  await page.locator('[data-testid="demo-status"]').selectOption('PAID')
  await page.locator('[data-testid="demo-run"]').click()
  await page.waitForFunction(() => document.querySelector('.live-stats strong')?.textContent === '14')
  assert.match(await page.locator('.live-table').innerText(), /#35/)
  report.cases.push('slide 3: interactive status query follows actual fixture and repository')

  await open(4)
  await page.locator('[data-testid="status-project-convention"]').waitFor({ timeout: 30000 })
  assert.equal((await page.locator('[data-testid="status-ai-direct"]').textContent()).trim(), '200 OK')
  assert.equal((await page.locator('[data-testid="status-project-convention"]').textContent()).trim(), '200 OK')
  const left = await page.locator('[data-testid="demo-ai-direct"] .live-json').textContent()
  const right = await page.locator('[data-testid="demo-project-convention"] .live-json').textContent()
  assert.ok(Array.isArray(JSON.parse(left).data))
  assert.ok(Array.isArray(JSON.parse(right).data.items))
  report.cases.push('slide 4: actual API response shapes differ, same data source')

  await open(5)
  await page.locator('[data-testid="consumer-project-convention"]').waitFor({ timeout: 30000 })
  assert.match(await page.locator('[data-testid="consumer-ai-direct"]').innerText(), /Consumer 不相容/)
  assert.match(await page.locator('[data-testid="consumer-project-convention"]').innerText(), /Consumer 相容/)
  report.cases.push('slide 5: existing Consumer contract fails and succeeds respectively')

  await open(8)
  assert.match(await page.locator('.story-source').innerText(), /async search\(query: OrderQuery\): Promise<OrderPage>/)
  report.cases.push('slide 8: source excerpt imported from the actual TypeScript file')
  assert.deepEqual(errors, [])
  report.passed = true
  process.stdout.write('PASS: 5 Slidev/MSW/source import integration checks\n')
} catch (e) {
  report.passed = false
  report.errors.push(String(e))
  process.stderr.write(String(e) + '\n')
  process.exitCode = 1
} finally {
  await mkdir('artifacts/slidev-msw', { recursive: true })
  await writeFile('artifacts/slidev-msw/report.json', JSON.stringify(report, null, 2) + '\n')
  await context.close()
  await browser.close()
}
