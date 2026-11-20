import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

// Same table definition used by the original Node example and the browser proxy.
export const ordersTable = sqliteTable('orders', {
  id: integer('id').primaryKey(),
  customerId: integer('customer_id').notNull(),
  status: text('status').notNull(),
  createdAt: text('created_at').notNull(),
})
