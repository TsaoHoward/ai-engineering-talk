import { createOrderApiApp, type Variant } from './server'

const variant = process.argv[2]
if (variant !== 'ai-direct' && variant !== 'project-convention') {
  throw new Error('Usage: tsx src/cli.ts ai-direct|project-convention')
}
const port = Number(process.env.PORT ?? (variant === 'ai-direct' ? '3101' : '3102'))
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be 1..65535')
const app = createOrderApiApp(variant as Variant)
app.server.listen(port, '127.0.0.1', () => {
  process.stdout.write(`Synthetic ${variant} API: http://127.0.0.1:${port}/api/orders\n`)
})
for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => app.server.close(() => { app.closeDatabase(); process.exit(0) }))
}
