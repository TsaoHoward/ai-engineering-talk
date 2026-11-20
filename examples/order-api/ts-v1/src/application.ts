import { and, count, desc, eq, gte, lt, type SQL } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/sqlite-proxy'
import type { ApiResponse, Order, OrderPage, OrderQuery } from './domain'
import { InvalidQueryError, parseOrderQuery, toExclusiveUtcDate } from './domain'
import { ordersTable } from './schema'
import type { DbCommand } from './mock-db'

export type Variant = 'ai-direct' | 'project-convention'
export type ApiResult = { status: number; body: unknown }
export type DbTransport = (command: DbCommand) => Promise<unknown[][] | Record<string, unknown>[]>

// Deliberately short path: controller -> repository -> parameterized SQL.
export class OrderRepository {
  constructor(private readonly execute: DbTransport) {}

  async search(query: OrderQuery): Promise<OrderPage> {
    const conditions: string[] = []
    const params: (string | number)[] = []
    if (query.status !== undefined) {
      conditions.push('status = ?')
      params.push(query.status)
    }
    if (query.fromDate && query.toDate) {
      conditions.push('created_at >= ? and created_at < ?')
      params.push(query.fromDate + 'T00:00:00.000Z', toExclusiveUtcDate(query.toDate))
    }
    const where = conditions.length ? ' WHERE ' + conditions.join(' AND ') : ''
    const countRows = await this.execute({
      sql: 'SELECT COUNT(*) AS value FROM orders' + where,
      params, method: 'objects',
    }) as { value: number }[]
    const items = await this.execute({
      sql: 'SELECT id, customer_id AS customerId, status, created_at AS createdAt FROM orders'
        + where + ' ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?',
      params: [...params, query.pageSize, query.page * query.pageSize],
      method: 'objects',
    }) as unknown as Order[]
    return { items, totalCount: countRows[0].value }
  }
}

// Same Drizzle ORM query builder as the Node version; only SQL execution is redirected.
export class OrderDao {
  private readonly db: ReturnType<typeof drizzle>

  constructor(execute: DbTransport) {
    this.db = drizzle(async (sql, params) => ({
      rows: await execute({ sql, params, method: 'all' }),
    }))
  }

  private filter(query: OrderQuery): SQL | undefined {
    const conditions: SQL[] = []
    if (query.status !== undefined) conditions.push(eq(ordersTable.status, query.status))
    if (query.fromDate && query.toDate) {
      conditions.push(gte(ordersTable.createdAt, query.fromDate + 'T00:00:00.000Z'))
      conditions.push(lt(ordersTable.createdAt, toExclusiveUtcDate(query.toDate)))
    }
    return conditions.length ? and(...conditions) : undefined
  }

  async selectPage(query: OrderQuery): Promise<Order[]> {
    return this.db.select().from(ordersTable)
      .where(this.filter(query))
      .orderBy(desc(ordersTable.createdAt), desc(ordersTable.id))
      .limit(query.pageSize)
      .offset(query.page * query.pageSize)
      .all()
  }

  async count(query: OrderQuery): Promise<number> {
    const rows = await this.db.select({ value: count() }).from(ordersTable)
      .where(this.filter(query)).all()
    return rows[0]?.value ?? 0
  }
}

export class OrderService {
  constructor(private readonly dao: OrderDao) {}
  async search(query: OrderQuery): Promise<OrderPage> {
    const [items, totalCount] = await Promise.all([
      this.dao.selectPage(query), this.dao.count(query),
    ])
    return { items, totalCount }
  }
}

function aiResponse<T>(data: T, totalCount: number | null) {
  return { code: 'OK', message: 'success', data, totalCount }
}
function response<T>(data: T): ApiResponse<T> {
  return { code: 'OK', message: 'success', data }
}

export function createController(variant: Variant, execute: DbTransport) {
  const repository = variant === 'ai-direct' ? new OrderRepository(execute) : undefined
  const service = variant === 'project-convention'
    ? new OrderService(new OrderDao(execute)) : undefined

  return async (request: Request): Promise<ApiResult> => {
    try {
      const url = new URL(request.url)
      if (url.pathname.endsWith('/status')) {
        const data = { service: 'synthetic-order-api', variant }
        return { status: 200, body: variant === 'ai-direct'
          ? aiResponse(data, null) : response(data) }
      }
      if (!url.pathname.endsWith('/orders')) {
        return { status: 404, body: { code: 'NOT_FOUND', message: 'Not found', data: null } }
      }
      const query = parseOrderQuery(url.searchParams)
      if (repository) {
        const page = await repository.search(query)
        return { status: 200, body: aiResponse(page.items, page.totalCount) }
      }
      if (service) return { status: 200, body: response(await service.search(query)) }
      throw new Error('No active variant')
    } catch (error) {
      if (error instanceof InvalidQueryError) {
        return { status: 400, body: { code: 'INVALID_QUERY', message: error.message, data: null } }
      }
      throw error // DB/ORM failures must not become a fake HTTP success
    }
  }
}
