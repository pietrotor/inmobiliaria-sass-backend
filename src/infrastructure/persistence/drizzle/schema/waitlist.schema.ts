import {
  pgTable,
  uuid,
  integer,
  timestamp,
  pgEnum,
  index,
} from 'drizzle-orm/pg-core';
import { units } from './unit.schema';
import { brokers } from './broker.schema';

export const waitlistStatusEnum = pgEnum('waitlist_status', [
  'WAITING',
  'NOTIFIED',
  'EXPIRED',
  'DISCARDED',
]);

export const waitlists = pgTable(
  'waitlist',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    unitId: uuid('unit_id')
      .notNull()
      .references(() => units.id, { onDelete: 'cascade' }),
    brokerId: uuid('broker_id')
      .notNull()
      .references(() => brokers.id, { onDelete: 'cascade' }),
    position: integer('position').notNull(),
    status: waitlistStatusEnum('status').notNull().default('WAITING'),
    notifiedAt: timestamp('notified_at'),
    expiresAt: timestamp('expires_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    index('idx_waitlist_unit').on(table.unitId),
    index('idx_waitlist_broker').on(table.brokerId),
    index('idx_waitlist_status').on(table.status),
  ],
);

export type WaitlistSchema = typeof waitlists.$inferSelect;
export type NewWaitlistSchema = typeof waitlists.$inferInsert;
