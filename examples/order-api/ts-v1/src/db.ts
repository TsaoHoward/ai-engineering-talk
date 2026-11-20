import Database from 'better-sqlite3'
import { readFileSync } from 'node:fs'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import type { Order } from './domain'

/** In-memory SQLite per server, seeded from exactly one checked-in fixture. */
export function openSeededDatabase(): Database.Database {
  const sqlite = new Database(':memory:')
  sqlite.exec(`CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`)
  const orders = JSON.parse(readFileSync(new URL('../fixtures/orders.json', import.meta.url), 'utf8')) as Order[]
  const insert = sqlite.prepare('INSERT INTO orders (id, customer_id, status, created_at) VALUES (?, ?, ?, ?)')
  sqlite.transaction(() => {
    for (const order of orders) insert.run(order.id, order.customerId, order.status, order.createdAt)
  })()
  return sqlite
}
