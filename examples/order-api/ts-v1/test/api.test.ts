import { test } from 'node:test'
import assert from 'node:assert/strict'
import { once } from 'node:events'
import { createOrderApiApp, type Variant } from '../src/server'

type Body = { code: string; message: string; data: any; totalCount?: number | null }

async function useServer(variant: Variant, run: (get: (path: string) => Promise<[number, Body]>) => Promise<void>) {
  const app = createOrderApiApp(variant)
  app.server.listen(0, '127.0.0.1')
  try {
    await once(app.server, 'listening')
    const address = app.server.address()
    if (!address || typeof address === 'string') throw new Error('Missing bound port')
    const get = async (path: string): Promise<[number, Body]> => {
      const res = await fetch(`http://127.0.0.1:${address.port}${path}`)
      return [res.status, await res.json() as Body]
    }
    await run(get)
  } finally {
    await new Promise<void>((resolve, reject) => app.server.close((err) => err ? reject(err) : resolve()))
    app.closeDatabase()
  }
}

for (const variant of ['ai-direct', 'project-convention'] as const) {
  test(`${variant}: real HTTP / filters / dates / page / invalid inputs`, async () => {
    await useServer(variant, async (get) => {
      const normalize = (body: Body) => variant === 'ai-direct'
        ? { items: body.data, totalCount: body.totalCount }
        : body.data
      let [status, body] = await get('/api/orders?pageSize=3')
      assert.equal(status, 200)
      let page = normalize(body)
      assert.equal(page.totalCount, 42)
      assert.deepEqual(page.items.map((item: { id: number }) => item.id), [42, 35, 28])

      ;[status, body] = await get('/api/orders?status=PAID&fromDate=2026-01-01&toDate=2026-01-01')
      assert.equal(status, 200)
      page = normalize(body)
      assert.equal(page.totalCount, 2)
      assert.deepEqual(page.items.map((item: { id: number }) => item.id), [29, 8])

      ;[status, body] = await get('/api/orders?fromDate=2026-01-01&toDate=2026-01-01')
      assert.equal(status, 200)
      page = normalize(body)
      assert.equal(page.totalCount, 6)
      assert.deepEqual(page.items.map((item: { id: number }) => item.id), [36, 29, 22, 15, 8, 1])

      ;[status, body] = await get('/api/orders?status=MISSING')
      assert.equal(status, 200)
      page = normalize(body)
      assert.equal(page.totalCount, 0)
      assert.deepEqual(page.items, [])

      for (const path of [
        '/api/orders?page=-1', '/api/orders?page=abc', '/api/orders?pageSize=0',
        '/api/orders?pageSize=101', '/api/orders?fromDate=2026-01-01',
        '/api/orders?fromDate=2026-02-30&toDate=2026-03-01',
        '/api/orders?fromDate=2026-01-03&toDate=2026-01-01',
      ]) {
        const [badStatus, badBody] = await get(path)
        assert.equal(badStatus, 400, path)
        assert.equal(badBody.code, 'INVALID_QUERY', path)
      }
    })
  })
}

test('contract comparison: same 42 results, intentional envelope and architecture differences', async () => {
  let ai: Body | undefined
  let expected: Body | undefined
  await useServer('ai-direct', async (get) => {
    const [status, body] = await get('/api/orders')
    assert.equal(status, 200)
    ai = body
    const [status2, statusBody] = await get('/api/status')
    assert.equal(status2, 200)
    assert.equal(statusBody.totalCount, null) // shared envelope changed for non-page endpoint
  })
  await useServer('project-convention', async (get) => {
    const [status, body] = await get('/api/orders')
    assert.equal(status, 200)
    expected = body
    const [, statusBody] = await get('/api/status')
    assert.deepEqual(Object.keys(statusBody).sort(), ['code', 'data', 'message'])
  })
  assert.ok(ai)
  assert.ok(expected)
  assert.deepEqual(ai.data, expected.data.items)
  assert.equal(ai.totalCount, expected.data.totalCount)
  assert.deepEqual(Object.keys(expected).sort(), ['code', 'data', 'message'])
  assert.deepEqual(Object.keys(ai).sort(), ['code', 'data', 'message', 'totalCount'])
})
