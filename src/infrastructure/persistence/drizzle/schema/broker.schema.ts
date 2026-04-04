import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { users } from './user.schema';

export const brokerPlanEnum = pgEnum('broker_plan', ['FREE', 'PRO']);
export const brokerStatusEnum = pgEnum('broker_status', [
  'PENDING',
  'APPROVED',
  'SUSPENDED',
]);

export const brokers = pgTable('broker', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  plan: brokerPlanEnum('plan').notNull().default('FREE'),
  status: brokerStatusEnum('status').notNull().default('PENDING'),
  companyName: varchar('company_name', { length: 255 }),
  licenseNumber: varchar('license_number', { length: 100 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type BrokerSchema = typeof brokers.$inferSelect;
export type NewBrokerSchema = typeof brokers.$inferInsert;
