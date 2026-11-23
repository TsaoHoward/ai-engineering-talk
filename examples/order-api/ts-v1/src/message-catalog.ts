import { MESSAGE_CODES } from './domain'

// Preloaded front-end table: message codes are translated only at the consumer.
export const MESSAGE_CATALOG: Readonly<Record<string, string>> = {
  [MESSAGE_CODES.success]: '查詢成功',
  [MESSAGE_CODES.invalidQuery]: '查詢條件不合法',
  [MESSAGE_CODES.notFound]: '找不到要求的資源',
  [MESSAGE_CODES.internalError]: '服務暫時無法處理請求',
}

export function resolveMessageCode(message: string): string | undefined {
  return Object.prototype.hasOwnProperty.call(MESSAGE_CATALOG, message)
    ? MESSAGE_CATALOG[message] : undefined
}
