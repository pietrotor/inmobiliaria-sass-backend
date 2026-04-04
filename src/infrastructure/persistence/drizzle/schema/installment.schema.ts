import {
  pgTable,
  uuid,
  varchar,
  real,
  timestamp,
  pgEnum,
  index,
} from 'drizzle-orm/pg-core';
import { paymentPlans } from './payment-plan.schema';

export const installmentStatusEnum = pgEnum('installment_status', [
  'PENDING',
  'PAID',
  'OVERDUE',
]);

export const installments = pgTable(
  'installment',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    paymentPlanId: uuid('payment_plan_id')
      .notNull()
      .references(() => paymentPlans.id, { onDelete: 'cascade' }),
    description: varchar('description', { length: 255 }).notNull(),
    amount: real('amount').notNull(),
    currency: varchar('currency', { length: 10 }).notNull().default('USD'),
    dueDate: timestamp('due_date').notNull(),
    status: installmentStatusEnum('status').notNull().default('PENDING'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('idx_installment_plan').on(table.paymentPlanId),
    index('idx_installment_due_date').on(table.dueDate),
  ],
);

export type InstallmentSchema = typeof installments.$inferSelect;
export type NewInstallmentSchema = typeof installments.$inferInsert;
