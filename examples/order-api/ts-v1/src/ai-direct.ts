import type Database from 'better-sqlite3'
import type { Order, OrderPage, OrderQuery } from './domain'
import { toExclusiveUtcDate } from './domain'

/** Intentionally bypasses the project's Service/DAO/ORM architecture. */
export class OrderRepository {
  constructor(private readonly sqlite: Database.Database) {}

  search(query: OrderQuery): OrderPage {
    const predicates: string[] = []
    const args: (string | number)[] = []
    if (query.status !== undefined) {
      predicates.push('status = ?')
      args.push(query.status)
    }
    if (query.fromDate && query.toDate) {
      predicates.push('created_at >= ? AND created_at < ?')
      args.push(`${query.fromDate}T00:00:00.000Z`, toExclusiveUtcDate(query.toDate))
    }
    const where = predicates.length ? ` WHERE ${predicates.join(' AND ')}` : ''
    const totalCount = (this.sqlite.prepare(`SELECT COUNT(*) AS value FROM orders${where}`)
      .get(...args) as { value: number }).value
    const rows = this.sqlite.prepare(
      `SELECT id, customer_id AS customerId, status, created_at AS createdAt
       FROM orders${where}
       ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`,
    ).all(...args, query.pageSize, query.page * query.pageSize) as Order[]
    return { items: rows, totalCount }
  }
}

/** Deliberately adds totalCount at the shared response root. */
export function aiResponse<T>(data: T, totalCount: number | null): {
  code: string; message: string; data: T; totalCount: number | null
} {
  return { code: 'OK', message: 'success', data, totalCount }
}
