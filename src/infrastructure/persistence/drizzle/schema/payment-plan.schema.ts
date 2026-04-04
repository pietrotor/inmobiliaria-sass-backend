import { pgTable, uuid, timestamp } from 'drizzle-orm/pg-core';
import { reservations } from './reservation.schema';
import { users } from './user.schema';

export const paymentPlans = pgTable('payment_plan', {
  id: uuid('id').primaryKey().defaultRandom(),
  reservationId: uuid('reservation_id')
    .notNull()
    .references(() => reservations.id, { onDelete: 'cascade' }),
  createdByUserId: uuid('created_by_user_id')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type PaymentPlanSchema = typeof paymentPlans.$inferSelect;
export type NewPaymentPlanSchema = typeof paymentPlans.$inferInsert;
