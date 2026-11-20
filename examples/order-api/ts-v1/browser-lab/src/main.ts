import { apiUrl, startMock, testUnsupportedSql, trace } from './worker'
import type { Variant } from './application'

declare global {
  interface Window {
    __mockReady?: boolean
    __runComparison?: (query?: string) => Promise<unknown>
    __rejectSql?: () => Promise<number>
    __mockTrace?: typeof trace
  }
}

function readExistingConsumer(body: unknown): number {
  if (typeof body !== 'object' || body === null || !('data' in body)) {
    throw new Error('Missing API response data')
  }
  const data: unknown = body.data
  if (!data || typeof data !== 'object' || !('items' in data) || !Array.isArray(data.items)) {
    throw new Error('Existing consumer requires data.items[]')
  }
  return data.items.length
}

async function get(variant: Variant, query: string) {
  const url = apiUrl(variant) + query
  const response = await fetch(url)
  const body: unknown = await response.json()
  let consumer: string
  try {
    consumer = 'compatible: ' + readExistingConsumer(body) + ' items'
  } catch {
    consumer = 'incompatible: expected data.items[]'
  }
  return { url, status: response.status, body, consumer }
}

export async function runComparison(query = '?pageSize=3') {
  trace.length = 0
  const ai = await get('ai-direct', query)
  const convention = await get('project-convention', query)
  const result = { ai, convention, trace: [...trace] }
  const display = document.querySelector('#output')
  if (display) display.textContent = JSON.stringify(result, null, 2)
  return result
}

const state = document.querySelector('#state')
try {
  await startMock()
  window.__runComparison = runComparison
  window.__rejectSql = testUnsupportedSql
  window.__mockTrace = trace
  window.__mockReady = true
  if (state) state.textContent = 'MSW browser worker active'
  const button = document.querySelector('#run')
  button?.addEventListener('click', () => {
    const select = document.querySelector('#query') as HTMLSelectElement | null
    void runComparison(select?.value ?? '?pageSize=3')
  })
  await runComparison()
} catch (error) {
  if (state) state.textContent = 'MSW failed: ' + String(error)
  throw error
}
