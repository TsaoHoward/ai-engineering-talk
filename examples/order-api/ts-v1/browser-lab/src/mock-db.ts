import fixture from '../../fixtures/orders.json'
import type { Order } from '../../src/domain'

export type DbMethod = 'all' | 'objects'
export type DbCommand = { sql: string; params: unknown[]; method: DbMethod }

const source: readonly Order[] = fixture as Order[]

export class UnsupportedSqlError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UnsupportedSqlError'
  }
}

const COLUMNS = 'id, customer_id, status, created_at'
const PAGE = /^select (id, customer_id(?: as customerid)?, status, created_at(?: as createdat)?) from orders(?: where (.+?))? order by created_at desc, id desc limit \? offset \?$/
const COUNT = /^select count\(\*\)(?: as [a-z][a-z0-9_]*)? from orders(?: where (.+))?$/

// This normalizes harmless whitespace/identifier quoting only; it does NOT parse arbitrary SQL.
function normalize(sql: string): string {
  return sql.trim().toLowerCase()
    .replace(/"/g, '')
    .replace(/\borders\./g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*,\s*/g, ', ')
}

function integerAt(params: unknown[], index: number, name: string): number {
  const value = params[index]
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) {
    throw new UnsupportedSqlError('Invalid ' + name + ' parameter')
  }
  return value
}

export function evaluateSql(command: DbCommand): unknown[][] | Record<string, unknown>[] {
  const normalized = normalize(command.sql)
  if (normalized.includes(';') || !['all', 'objects'].includes(command.method)) {
    throw new UnsupportedSqlError('Unsupported query syntax or row mode')
  }

  const countMatch = COUNT.exec(normalized)
  const pageMatch = PAGE.exec(normalized)
  if (!countMatch && !pageMatch) throw new UnsupportedSqlError('Unknown SQL shape: ' + normalized)

  // Only three semantic predicate shapes are accepted. No joins, arbitrary WHERE, DML or SQL parser.
  const where = (countMatch?.[1] ?? pageMatch?.[2] ?? '')
    .replace(/[()]/g, '').trim()
  const predicates = new Set([
    '',
    'status = ?',
    'created_at >= ? and created_at < ?',
    'status = ? and created_at >= ? and created_at < ?',
  ])
  if (!predicates.has(where)) throw new UnsupportedSqlError('Unsupported WHERE shape: ' + where)
  const byStatus = where.includes('status = ?')
  const byDate = where.includes('created_at >= ?')
  const filterParamCount = Number(byStatus) + Number(byDate) * 2
  const expectedCount = filterParamCount + (pageMatch ? 2 : 0)
  if (command.params.length !== expectedCount) {
    throw new UnsupportedSqlError('Expected ' + expectedCount + ' SQL parameters')
  }

  let n = 0
  const status = byStatus ? command.params[n++] : undefined
  const from = byDate ? command.params[n++] : undefined
  const to = byDate ? command.params[n++] : undefined
  if (byStatus && typeof status !== 'string') throw new UnsupportedSqlError('Invalid status binding')
  if (byDate && (typeof from !== 'string' || typeof to !== 'string'
    || !/^\d{4}-\d{2}-\d{2}T00:00:00\.000Z$/.test(from)
    || !/^\d{4}-\d{2}-\d{2}T00:00:00\.000Z$/.test(to) || from >= to)) {
    throw new UnsupportedSqlError('Invalid UTC interval binding')
  }

  const filtered = source.filter(row =>
    (!byStatus || row.status === status)
    && (!byDate || (row.createdAt >= (from as string) && row.createdAt < (to as string))))
  if (countMatch) {
    return command.method === 'all' ? [[filtered.length]] : [{ value: filtered.length }]
  }

  const limit = integerAt(command.params, n++, 'limit')
  const offset = integerAt(command.params, n, 'offset')
  if (limit < 1 || limit > 100) throw new UnsupportedSqlError('Invalid limit')
  const selected = [...filtered]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id)
    .slice(offset, offset + limit)
  if (command.method === 'objects') return selected.map(row => ({ ...row }))
  return selected.map(row => [row.id, row.customerId, row.status, row.createdAt])
}
