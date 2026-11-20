import{E as e,Q as t,R as n,S as r,U as i,Z as a,_ as o,b as s,bt as c,g as l,gt as u,v as d,vt as f,w as p}from"./modules/shiki-BBsiBeyD.js";import{b as m,x as h}from"./index-DHHwCK4u.js";import{t as g}from"./slidev/default-FIM7qctk.js";var _=`import { and, count, desc, eq, gte, lt, type SQL } from 'drizzle-orm'
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

// Real Drizzle ORM query builder; its generated SQL is executed by the bounded MSW DB adapter.
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
  // #region service-search
  async search(query: OrderQuery): Promise<OrderPage> {
    const [items, totalCount] = await Promise.all([
      this.dao.selectPage(query), this.dao.count(query),
    ])
    return { items, totalCount }
  }
  // #endregion service-search
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
`,v={class:`story-source`,"aria-label":`Source excerpt imported from canonical Order API`},y=p({__name:`OrderSourceExcerpt`,props:{region:{default:`service-search`}},setup(e){let{$slidev:t,$nav:r,$clicksContext:i,$clicks:a,$page:u,$renderContext:d,$frontmatter:f}=h(),p=e,m=l(()=>{let e=`// #region `+p.region,t=`// #endregion `+p.region,n=_.indexOf(e),r=_.indexOf(t,n+e.length);return n<0||r<0?`Source region unavailable: `+p.region:_.slice(n+e.length,r).replace(/^\s*\n/,``).replace(/\n\s*$/,``).split(`
`).map(e=>e.replace(/^  /,``)).join(`
`)});return(e,t)=>(n(),s(`div`,v,[t[0]||=o(`div`,{class:`story-source-caption`},[o(`span`,null,`SSOT / src/application.ts`),o(`span`,null,`read-only source import`)],-1),o(`pre`,null,[o(`code`,null,c(m.value),1)])]))}}),b={class:`chapter-shell`},x={class:`method-layout`},S={class:`method-main`},C={class:`method-side`},w={class:`method-chip`},T={class:`method-chip`},E={class:`method-chip`},D={class:`chapter-note-line`},O={__name:`slides.md__slidev_8`,setup(c){let{$slidev:l,$nav:p,$clicksContext:_,$clicks:v,$page:O,$renderContext:k,$frontmatter:A}=h();return _.setup(),(c,l)=>{let p=y,h=i(`click`);return n(),d(g,f(e(u(m)(u(A),7))),{default:a(()=>[o(`main`,b,[l[5]||=o(`header`,{class:`chapter-heading`},[o(`span`,{class:`chapter-kicker`},`02 / CHAPTER TWO · SPECIFICATION`),o(`h1`,null,`其實，這些都是規格。`),o(`p`,null,`工程師不是每次都從完整需求書開始，而是在程式、型別、介面與測試中讀取線索。`)],-1),o(`div`,x,[o(`section`,S,[l[0]||=o(`div`,{class:`method-overline`},`既有的 TypeScript Method · 從 SSOT 原始碼直接讀取`,-1),r(p,{region:`service-search`})]),o(`div`,C,[t((n(),s(`div`,w,[...l[1]||=[o(`strong`,null,`Method / Types`,-1),o(`span`,null,`OrderQuery → OrderPage`,-1)]])),[[h]]),t((n(),s(`div`,T,[...l[2]||=[o(`strong`,null,`Constructor / Dependency`,-1),o(`span`,null,`OrderService(new OrderDao(...))`,-1)]])),[[h]]),t((n(),s(`div`,E,[...l[3]||=[o(`strong`,null,`Consumer / Tests`,-1),o(`span`,null,`data.items · UTC · totalCount`,-1)]])),[[h]])])]),t((n(),s(`div`,D,[...l[4]||=[o(`strong`,null,`簽章不是全部`,-1),o(`span`,null,`它描述局部輸入與輸出；完整行為仍需要查閱其他契約及測試。`,-1)]])),[[h]]),l[6]||=o(`footer`,{class:`chapter-footer`},[o(`span`,null,`第二章：規格 → 模組 → 工作單元`),o(`span`,null,`07 / 從每天的開發經驗出發`)],-1)])]),_:1},16)}}};export{O as default};