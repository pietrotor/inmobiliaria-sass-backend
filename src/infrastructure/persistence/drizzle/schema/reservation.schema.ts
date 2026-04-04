import {
  pgTable,
  uuid,
  varchar,
  real,
  timestamp,
  jsonb,
  pgEnum,
  index,
} from 'drizzle-orm/pg-core';
import { developers } from './developer.schema';
import { brokers } from './broker.schema';
import { reservationIntents } from './reservation-intent.schema';
import { users } from './user.schema';

export const reservationStatusEnum = pgEnum('reservation_status', [
  'RESERVED',
  'AGREEMENT_SIGNED',
  'IN_PROCESS',
  'DELIVERED',
  'FALLEN',
]);

export const salesChannelEnum = pgEnum('sales_channel', ['BROKER', 'DIRECT']);

export const reservations = pgTable(
  'reservation',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    unitIds: jsonb('unit_ids').notNull(),
    clientName: varchar('client_name', { length: 255 }).notNull(),
    clientNationalId: varchar('client_national_id', { length: 50 }).notNull(),
    clientPhone: varchar('client_phone', { length: 50 }).notNull(),
    clientEmail: varchar('client_email', { length: 255 }),
    salesChannel: salesChannelEnum('sales_channel').notNull(),
    brokerId: uuid('broker_id').references(() => brokers.id),
    intentId: uuid('intent_id').references(() => reservationIntents.id),
    executiveId: uuid('executive_id').references(() => users.id),
    developerId: uuid('developer_id')
      .notNull()
      .references(() => developers.id, { onDelete: 'cascade' }),
    reservationPaymentAmount: real('reservation_payment_amount').notNull(),
    reservationPaymentCurrency: varchar('reservation_payment_currency', {
      length: 10,
    }).notNull(),
    reservationPaymentDate: timestamp('reservation_payment_date').notNull(),
    agreementDeadline: timestamp('agreement_deadline'),
    status: reservationStatusEnum('status').notNull().default('RESERVED'),
    agreementSignedDate: timestamp('agreement_signed_date'),
    deliveryDate: timestamp('delivery_date'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('idx_reservation_developer').on(table.developerId),
    index('idx_reservation_broker').on(table.brokerId),
    index('idx_reservation_status').on(table.status),
  ],
);

export type ReservationSchema = typeof reservations.$inferSelect;
export type NewReservationSchema = typeof reservations.$inferInsert;
