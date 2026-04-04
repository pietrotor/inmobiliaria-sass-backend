import {
  pgTable,
  uuid,
  varchar,
  boolean,
  real,
  timestamp,
  jsonb,
  pgEnum,
  index,
} from 'drizzle-orm/pg-core';
import { brokers } from './broker.schema';
import { projects } from './project.schema';

export const intentStatusEnum = pgEnum('intent_status', [
  'ACTIVE',
  'APPROVED',
  'REJECTED',
  'EXPIRED',
  'CANCELLED',
]);

export const rejectionReasonEnum = pgEnum('rejection_reason', [
  'CLIENT_NOT_QUALIFIED',
  'INCOMPLETE_DATA',
  'BROKER_NOT_ENABLED',
  'TAKEN_INTERNALLY',
  'OTHER',
]);

export const reservationIntents = pgTable(
  'reservation_intent',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    brokerId: uuid('broker_id')
      .notNull()
      .references(() => brokers.id, { onDelete: 'cascade' }),
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    unitIds: jsonb('unit_ids').notNull(),
    clientName: varchar('client_name', { length: 255 }).notNull(),
    clientNationalId: varchar('client_national_id', { length: 50 }).notNull(),
    clientPhone: varchar('client_phone', { length: 50 }).notNull(),
    clientEmail: varchar('client_email', { length: 255 }),
    hasFinancing: boolean('has_financing').notNull().default(false),
    hasVisited: boolean('has_visited').notNull().default(false),
    status: intentStatusEnum('status').notNull().default('ACTIVE'),
    deadlineAt: timestamp('deadline_at').notNull(),
    pausedTimeRemainingMs: real('paused_time_remaining_ms'),
    rejectionReason: rejectionReasonEnum('rejection_reason'),
    rejectionNote: varchar('rejection_note', { length: 500 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('idx_intent_broker').on(table.brokerId),
    index('idx_intent_project').on(table.projectId),
    index('idx_intent_status').on(table.status),
    index('idx_intent_national_id').on(table.clientNationalId),
  ],
);

export type ReservationIntentSchema = typeof reservationIntents.$inferSelect;
export type NewReservationIntentSchema =
  typeof reservationIntents.$inferInsert;
