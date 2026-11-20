import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

// Gate A temporary copy; later consolidate with ../src/schema.ts.
export const ordersTable = sqliteTable('orders', {
  id: integer('id').primaryKey(),
  customerId: integer('customer_id').notNull(),
  status: text('status').notNull(),
  createdAt: text('created_at').notNull(),
})
