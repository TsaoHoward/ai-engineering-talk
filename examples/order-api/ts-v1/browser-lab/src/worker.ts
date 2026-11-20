import { http, HttpResponse } from 'msw'
import { setupWorker } from 'msw/browser'
import { createController, type Variant, type DbTransport } from './application'
import { evaluateSql, UnsupportedSqlError, type DbCommand } from './mock-db'

const base = new URL(import.meta.env.BASE_URL, window.location.origin)
const address = (path: string) => new URL(path, base).href

export const trace: Array<{ stage: string; detail: string }> = []

// No mock response is hard-coded here. The MSW DB handler invokes the bounded SQL evaluator.
const transport: DbTransport = async (command) => {
  const reply = await fetch(address('mock/db/query'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(command),
  })
  if (!reply.ok) throw new Error('Mock DB rejected SQL: ' + reply.status + ' ' + await reply.text())
  const json = await reply.json() as { rows: unknown[][] | Record<string, unknown>[] }
  return json.rows
}

const handlers = [
  http.post(address('mock/db/query'), async ({ request }) => {
    const command = await request.json() as DbCommand
    try {
      const rows = evaluateSql(command)
      trace.push({ stage: 'DB', detail: command.sql })
      return HttpResponse.json({ rows })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown DB error'
      trace.push({ stage: 'DB_REJECTED', detail: message })
      return HttpResponse.json({ error: message }, {
        status: error instanceof UnsupportedSqlError ? 422 : 500,
      })
    }
  }),
  ...(['ai-direct', 'project-convention'] as const).flatMap((variant: Variant) => {
    const controller = createController(variant, transport)
    return ['orders', 'status'].map(resource =>
      http.get(address('mock/api/' + variant + '/' + resource), async ({ request }) => {
        trace.push({ stage: 'API', detail: variant + '/' + resource })
        try {
          const result = await controller(request)
          return HttpResponse.json(result.body, { status: result.status })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unhandled error'
          return HttpResponse.json({ code: 'INTERNAL_ERROR', message, data: null }, { status: 500 })
        }
      }))
  }),
  http.all(address('mock/*'), () =>
    HttpResponse.json({ error: 'Unknown mock route' }, { status: 404 })),
]

const worker = setupWorker(...handlers)

export async function startMock() {
  await worker.start({
    quiet: true,
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: address('mockServiceWorker.js'),
      options: { scope: base.pathname },
    },
  })
}

export const apiUrl = (variant: Variant, endpoint = 'orders') =>
  address('mock/api/' + variant + '/' + endpoint)

export async function testUnsupportedSql(): Promise<number> {
  const response = await fetch(address('mock/db/query'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ sql: 'DELETE FROM orders', params: [], method: 'all' }),
  })
  return response.status
}
