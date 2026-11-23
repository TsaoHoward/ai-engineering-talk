import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

// Canonical order table schema. Used by the real Drizzle DAO in the browser application.
export const ordersTable = sqliteTable('orders', {
  id: integer('id').primaryKey(),
  customerId: integer('customer_id').notNull(),
  status: text('status').notNull(),
  createdAt: text('created_at').notNull(),
})
