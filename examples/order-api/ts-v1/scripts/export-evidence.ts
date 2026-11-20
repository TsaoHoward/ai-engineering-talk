import { mkdir, writeFile } from 'node:fs/promises'
import { once } from 'node:events'
import { createOrderApiApp, type Variant } from '../src/server'

const outDir = new URL('../generated/', import.meta.url)
await mkdir(outDir, { recursive: true })

for (const variant of ['ai-direct', 'project-convention'] as const satisfies readonly Variant[]) {
  const app = createOrderApiApp(variant)
  app.server.listen(0, '127.0.0.1')
  try {
    await once(app.server, 'listening')
    const addr = app.server.address()
    if (!addr || typeof addr === 'string') throw new Error('Missing port')
    const base = `http://127.0.0.1:${addr.port}`
    for (const [key, route] of [
      ['orders', '/api/orders?pageSize=3'],
      ['filtered-orders', '/api/orders?status=PAID&fromDate=2026-01-01&toDate=2026-01-01'],
      ['status', '/api/status'],
    ]) {
      const res = await fetch(base + route)
      if (!res.ok) throw new Error(`${variant} ${route}: HTTP ${res.status}`)
      await writeFile(new URL(`${variant}-${key}.json`, outDir), `${JSON.stringify(await res.json(), null, 2)}\n`)
    }
  } finally {
    await new Promise<void>((resolve, reject) => app.server.close(err => err ? reject(err) : resolve()))
    app.closeDatabase()
  }
}
process.stdout.write('Exported deterministic live HTTP evidence to generated/*.json\n')
