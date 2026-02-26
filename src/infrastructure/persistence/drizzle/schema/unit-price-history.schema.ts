import {
  pgTable,
  uuid,
  real,
  varchar,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { units } from './unit.schema';
import { users } from './user.schema';

export const unitPriceHistory = pgTable(
  'unit_price_history',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    unitId: uuid('unit_id')
      .notNull()
      .references(() => units.id, { onDelete: 'cascade' }),
    previousPriceUSD: real('previous_price_usd').notNull(),
    newPriceUSD: real('new_price_usd').notNull(),
    changedByUserId: uuid('changed_by_user_id')
      .notNull()
      .references(() => users.id),
    reason: varchar('reason', { length: 500 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [index('idx_unit_price_history_unit').on(table.unitId)],
);

export type UnitPriceHistorySchema = typeof unitPriceHistory.$inferSelect;
export type NewUnitPriceHistorySchema = typeof unitPriceHistory.$inferInsert;
