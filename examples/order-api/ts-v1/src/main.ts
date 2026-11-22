import { apiUrl, startMock, testUnsupportedSql, probeSql, trace } from './worker'
import type { Variant } from './application'
import { readExistingOrdersConsumer, readExistingErrorConsumer, ExistingConsumerContractError } from './existing-consumer'

declare global {
  interface Window {
    __mockReady?: boolean
    __runComparison?: (query?: string) => Promise<unknown>
    __rejectSql?: () => Promise<number>
    __probeSql?: (command: unknown) => Promise<{ status: number; body: unknown }>
    __mockTrace?: typeof trace
  }
}

async function get(variant: Variant, query: string) {
  const url = apiUrl(variant) + query
  const response = await fetch(url)
  const body: unknown = await response.json()
  let consumer: string
  let consumed: { itemsCount?: number; totalCount?: number; displayMessage?: string } | null = null
  if (response.ok) {
    try {
      const page = readExistingOrdersConsumer(body)
      consumed = { itemsCount: page.items.length, totalCount: page.totalCount }
      consumer = 'compatible: ' + page.items.length + ' items'
    } catch (error) {
      if (!(error instanceof ExistingConsumerContractError)) throw error
      consumer = 'incompatible: ' + error.message
    }
  } else {
    try {
      const displayMessage = readExistingErrorConsumer(body)
      consumed = { displayMessage }
      consumer = 'compatible: message code resolved'
    } catch (error) {
      if (!(error instanceof ExistingConsumerContractError)) throw error
      consumer = 'incompatible: ' + error.message
    }
  }
  return { variant, url, status: response.status, body, consumer, consumed }
}

export async function runComparison(query = '?pageSize=3') {
  trace.length = 0
  const ai = await get('ai-direct', query)
  const convention = await get('project-convention', query)
  const result = {
    sourceRevision: import.meta.env.VITE_SOURCE_SHA || 'local-unversioned',
    provenance: 'Chromium / MSW browser worker / bounded SQL evaluator (no real database)',
    query,
    ai, convention, trace: trace.map(item => ({ ...item })),
  }
  const display = document.querySelector('#output')
  if (display) display.textContent = JSON.stringify(result, null, 2)
  return result
}

const state = document.querySelector('#state')
try {
  await startMock()
  window.__runComparison = runComparison
  window.__rejectSql = testUnsupportedSql
  window.__probeSql = probeSql
  window.__mockTrace = trace
  if (state) state.textContent = 'MSW browser worker active'
  const button = document.querySelector('#run')
  button?.addEventListener('click', () => {
    const select = document.querySelector('#query') as HTMLSelectElement | null
    void runComparison(select?.value ?? '?pageSize=3')
  })
  await runComparison()
  window.__mockReady = true
} catch (error) {
  if (state) state.textContent = 'MSW failed: ' + String(error)
  throw error
}
