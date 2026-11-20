import type { Order, OrderPage } from '../../src/domain'

// An established, synthetic front-end contract: the Consumer expects a
// paginated payload inside the unchanged shared {code, message, data} envelope.
// This is NOT a requirement for every HTTP consumer or every project.
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
  if (!record(body) || body.code !== 'OK' || !('data' in body)) {
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
