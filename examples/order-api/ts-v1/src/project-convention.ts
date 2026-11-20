import type Database from 'better-sqlite3'
import { and, count, desc, eq, gte, lt, type SQL } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { ordersTable } from './db'
import type { ApiResponse, Order, OrderPage, OrderQuery } from './domain'
import { toExclusiveUtcDate } from './domain'

/** Project convention: database implementation is behind OrderDao. */
export class OrderDao {
  private readonly db: ReturnType<typeof drizzle>

  constructor(sqlite: Database.Database) {
    this.db = drizzle(sqlite)
  }

  private filter(query: OrderQuery): SQL | undefined {
    const conditions: SQL[] = []
    if (query.status !== undefined) conditions.push(eq(ordersTable.status, query.status))
    if (query.fromDate && query.toDate) {
      conditions.push(gte(ordersTable.createdAt, `${query.fromDate}T00:00:00.000Z`))
      conditions.push(lt(ordersTable.createdAt, toExclusiveUtcDate(query.toDate)))
    }
    return conditions.length ? and(...conditions) : undefined
  }

  selectPage(query: OrderQuery): Order[] {
    return this.db.select().from(ordersTable)
      .where(this.filter(query))
      .orderBy(desc(ordersTable.createdAt), desc(ordersTable.id))
      .limit(query.pageSize)
      .offset(query.page * query.pageSize)
      .all()
  }

  count(query: OrderQuery): number {
    return this.db.select({ value: count() }).from(ordersTable)
      .where(this.filter(query)).get()?.value ?? 0
  }
}

export class OrderService {
  constructor(private readonly dao: OrderDao) {}

  search(query: OrderQuery): OrderPage {
    return { items: this.dao.selectPage(query), totalCount: this.dao.count(query) }
  }
}

/** Shared envelope remains unchanged for all endpoints. */
export function response<T>(data: T): ApiResponse<T> {
  return { code: 'OK', message: 'success', data }
}
