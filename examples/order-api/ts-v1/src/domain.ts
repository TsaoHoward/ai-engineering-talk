export interface Order {
  id: number
  customerId: number
  status: string
  createdAt: string // UTC ISO 8601; stable lexical order in bounded mock
}

export interface OrderQuery {
  status?: string
  fromDate?: string
  toDate?: string
  page: number
  pageSize: number
}

export interface OrderPage {
  items: Order[]
  totalCount: number
}

export interface ApiResponse<T> {
  code: string
  message: string
  data: T
}

// Established API-to-UI message contract. Error category remains in 'code'.
export const MESSAGE_CODES = {
  success: 'm0000',
  invalidQuery: 'm0001',
  notFound: 'm0002',
  internalError: 'm0003',
} as const

export class InvalidQueryError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidQueryError'
  }
}

function nonNegativeInteger(value: string | null, fallback: number, name: string): number {
  if (value === null) return fallback
  if (!/^(0|[1-9]\d*)$/.test(value)) throw new InvalidQueryError(`${name} must be a non-negative integer`)
  const parsed = Number(value)
  if (!Number.isSafeInteger(parsed)) throw new InvalidQueryError(`${name} is too large`)
  return parsed
}

function validUtcDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00.000Z`)
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export function parseOrderQuery(searchParams: URLSearchParams): OrderQuery {
  const page = nonNegativeInteger(searchParams.get('page'), 0, 'page')
  const pageSize = nonNegativeInteger(searchParams.get('pageSize'), 20, 'pageSize')
  if (pageSize < 1 || pageSize > 100) throw new InvalidQueryError('pageSize must be 1..100')
  if (!Number.isSafeInteger(page * pageSize)) throw new InvalidQueryError('pagination offset is too large')

  const fromDate = searchParams.get('fromDate') ?? undefined
  const toDate = searchParams.get('toDate') ?? undefined
  if ((fromDate === undefined) !== (toDate === undefined)) {
    throw new InvalidQueryError('fromDate and toDate must be supplied together')
  }
  if (fromDate && toDate) {
    if (!validUtcDate(fromDate) || !validUtcDate(toDate) || fromDate > toDate) {
      throw new InvalidQueryError('invalid UTC date interval')
    }
  }
  return {
    status: searchParams.get('status') ?? undefined,
    fromDate,
    toDate,
    page,
    pageSize,
  }
}

export function toExclusiveUtcDate(date: string): string {
  const instant = new Date(`${date}T00:00:00.000Z`)
  instant.setUTCDate(instant.getUTCDate() + 1)
  return instant.toISOString()
}
