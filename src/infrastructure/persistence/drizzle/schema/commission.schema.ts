import {
  pgTable,
  uuid,
  real,
  varchar,
  timestamp,
  jsonb,
  pgEnum,
  index,
} from 'drizzle-orm/pg-core';
import { brokers } from './broker.schema';
import { reservationIntents } from './reservation-intent.schema';
import { reservations } from './reservation.schema';
import { developers } from './developer.schema';
import { users } from './user.schema';

export const commissionStatusEnum = pgEnum('commission_status', [
  'PENDING',
  'PAID',
  'IN_DISPUTE',
]);

export const commissions = pgTable(
  'commission',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    brokerId: uuid('broker_id')
      .notNull()
      .references(() => brokers.id, { onDelete: 'cascade' }),
    intentId: uuid('intent_id')
      .notNull()
      .references(() => reservationIntents.id),
    reservationId: uuid('reservation_id')
      .notNull()
      .references(() => reservations.id),
    developerId: uuid('developer_id')
      .notNull()
      .references(() => developers.id, { onDelete: 'cascade' }),
    units: jsonb('units').notNull(),
    totalAmountUSD: real('total_amount_usd').notNull(),
    status: commissionStatusEnum('status').notNull().default('PENDING'),
    paidAt: timestamp('paid_at'),
    paidByUserId: uuid('paid_by_user_id').references(() => users.id),
    disputeNote: varchar('dispute_note', { length: 500 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    index('idx_commission_broker').on(table.brokerId),
    index('idx_commission_developer').on(table.developerId),
    index('idx_commission_status').on(table.status),
  ],
);

export type CommissionSchema = typeof commissions.$inferSelect;
export type NewCommissionSchema = typeof commissions.$inferInsert;
