import type { Order, OrderPage } from './domain'
import { MESSAGE_CODES } from './domain'
import { resolveMessageCode } from './message-catalog'

// Existing synthetic consumer: success data is a page, errors use a
// preloaded message-code table. Both variants are evaluated by the same code.
export class ExistingConsumerContractError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ExistingConsumerContractError'
  }
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function readExistingOrdersConsumer(body: unknown): OrderPage {
  if (!record(body) || body.code !== 'OK' || body.message !== MESSAGE_CODES.success || !('data' in body)) {
    throw new ExistingConsumerContractError('Expected success envelope { code, message, data }')
  }
  const data = body.data
  if (!record(data) || !Array.isArray(data.items)) {
    throw new ExistingConsumerContractError('Existing consumer expects data.items[]')
  }
  if (typeof data.totalCount !== 'number' || !Number.isSafeInteger(data.totalCount) || data.totalCount < 0) {
    throw new ExistingConsumerContractError('Existing consumer expects data.totalCount')
  }
  for (const item of data.items) {
    if (!record(item) || !Number.isSafeInteger(item.id) || typeof item.status !== 'string'
      || typeof item.createdAt !== 'string') {
      throw new ExistingConsumerContractError('Invalid order item shape')
    }
  }
  return { items: data.items as Order[], totalCount: data.totalCount as number }
}

export function readExistingErrorConsumer(body: unknown): string {
  if (!record(body) || typeof body.code !== 'string' || body.code === 'OK'
    || typeof body.message !== 'string') {
    throw new ExistingConsumerContractError('Expected error envelope { code, message, data }')
  }
  const display = resolveMessageCode(body.message)
  if (display === undefined) {
    throw new ExistingConsumerContractError('Unknown message code: ' + body.message)
  }
  return display
}
