import {
  pgTable,
  uuid,
  real,
  varchar,
  timestamp,
  pgEnum,
  index,
} from 'drizzle-orm/pg-core';
import { installments } from './installment.schema';
import { users } from './user.schema';

export const paymentMethodEnum = pgEnum('payment_method', [
  'BANK_TRANSFER',
  'QR',
  'CASH',
  'OTHER',
]);

export const payments = pgTable(
  'payment',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    installmentId: uuid('installment_id')
      .notNull()
      .references(() => installments.id, { onDelete: 'cascade' }),
    amount: real('amount').notNull(),
    receivedDate: timestamp('received_date').notNull(),
    paymentMethod: paymentMethodEnum('payment_method').notNull(),
    reference: varchar('reference', { length: 255 }),
    recordedByUserId: uuid('recorded_by_user_id')
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [index('idx_payment_installment').on(table.installmentId)],
);

export type PaymentSchema = typeof payments.$inferSelect;
export type NewPaymentSchema = typeof payments.$inferInsert;
