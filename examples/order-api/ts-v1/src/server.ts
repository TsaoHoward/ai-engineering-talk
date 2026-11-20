import { createServer, type Server } from 'node:http'
import type Database from 'better-sqlite3'
import { aiResponse, OrderRepository } from './ai-direct'
import { openSeededDatabase } from './db'
import { InvalidQueryError, parseOrderQuery } from './domain'
import { OrderDao, OrderService, response } from './project-convention'

export type Variant = 'ai-direct' | 'project-convention'
export interface OrderApiApp { server: Server; closeDatabase: () => void }

export function createOrderApiApp(variant: Variant): OrderApiApp {
  const sqlite: Database.Database = openSeededDatabase()
  const repository = new OrderRepository(sqlite)
  const service = new OrderService(new OrderDao(sqlite))

  const server = createServer((request, res) => {
    res.setHeader('content-type', 'application/json; charset=utf-8')
    res.setHeader('cache-control', 'no-store')
    const reply = (status: number, body: unknown) => {
      res.statusCode = status
      res.end(JSON.stringify(body))
    }
    try {
      const url = new URL(request.url ?? '/', 'http://localhost')
      if (request.method !== 'GET') {
        reply(405, { code: 'METHOD_NOT_ALLOWED', message: 'GET only', data: null })
        return
      }
      if (url.pathname === '/api/status') {
        const data = { service: 'synthetic-order-api', variant }
        reply(200, variant === 'ai-direct' ? aiResponse(data, null) : response(data))
        return
      }
      if (url.pathname !== '/api/orders') {
        reply(404, { code: 'NOT_FOUND', message: 'Not found', data: null })
        return
      }
      const query = parseOrderQuery(url.searchParams)
      if (variant === 'ai-direct') {
        const page = repository.search(query)
        reply(200, aiResponse(page.items, page.totalCount))
      } else {
        reply(200, response(service.search(query)))
      }
    } catch (error) {
      if (error instanceof InvalidQueryError) {
        reply(400, { code: 'INVALID_QUERY', message: error.message, data: null })
      } else {
        reply(500, { code: 'INTERNAL_ERROR', message: 'Internal server error', data: null })
      }
    }
  })
  return { server, closeDatabase: () => sqlite.close() }
}
