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

const PAGE = /^select (id, customer_id(?: as customerid)?, status, created_at(?: as createdat)?) from orders(?: where (.+?))? order by created_at desc, id desc limit \?(?: offset \?)?$/
const COUNT = /^select count\(\*\)(?: as value)? from orders(?: where (.+))?$/

// Parentheses may group Drizzle's recognized AND predicates, but may not be
// unbalanced or empty. Flattening them is safe only within our AND-only allowlist.
function flattenAllowedWhere(where: string): string {
  if (/\(\s*\)/.test(where)) throw new UnsupportedSqlError('Empty WHERE grouping')
  let depth = 0
  for (const character of where) {
    if (character === '(') depth++
    if (character === ')') depth--
    if (depth < 0) throw new UnsupportedSqlError('Unbalanced WHERE grouping')
  }
  if (depth !== 0) throw new UnsupportedSqlError('Unbalanced WHERE grouping')
  return where.replace(/[()]/g, '').replace(/\s+/g, ' ').trim()
}

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
  if (!command || typeof command.sql !== 'string' || !Array.isArray(command.params)
    || !['all', 'objects'].includes(command.method)) {
    throw new UnsupportedSqlError('Malformed SQL command')
  }
  const normalized = normalize(command.sql)
  if (normalized.includes(';')) {
    throw new UnsupportedSqlError('Unsupported query syntax')
  }

  const countMatch = COUNT.exec(normalized)
  const pageMatch = PAGE.exec(normalized)
  if (!countMatch && !pageMatch) throw new UnsupportedSqlError('Unknown SQL shape: ' + normalized)

  // Only three semantic predicate shapes are accepted. No joins, arbitrary WHERE, DML or SQL parser.
  const where = flattenAllowedWhere(countMatch?.[1] ?? pageMatch?.[2] ?? '')
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
  const hasOffset = Boolean(pageMatch && normalized.endsWith(' offset ?'))
  const expectedCount = filterParamCount + (pageMatch ? (hasOffset ? 2 : 1) : 0)
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
  const offset = hasOffset ? integerAt(command.params, n, 'offset') : 0
  if (limit < 1 || limit > 100) throw new UnsupportedSqlError('Invalid limit')
  const selected = [...filtered]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id)
    .slice(offset, offset + limit)
  if (command.method === 'objects') return selected.map(row => ({ ...row }))
  return selected.map(row => [row.id, row.customerId, row.status, row.createdAt])
}
