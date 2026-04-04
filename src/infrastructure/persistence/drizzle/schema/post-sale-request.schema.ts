import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  index,
} from 'drizzle-orm/pg-core';
import { units } from './unit.schema';
import { reservations } from './reservation.schema';
import { users } from './user.schema';

export const postSaleRequestTypeEnum = pgEnum('post_sale_request_type', [
  'CLAIM',
  'WARRANTY',
  'INQUIRY',
]);

export const postSaleRequestStatusEnum = pgEnum('post_sale_request_status', [
  'OPEN',
  'IN_PROGRESS',
  'RESOLVED',
  'CLOSED',
]);

export const postSaleRequests = pgTable(
  'post_sale_request',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    unitId: uuid('unit_id')
      .notNull()
      .references(() => units.id, { onDelete: 'cascade' }),
    reservationId: uuid('reservation_id')
      .notNull()
      .references(() => reservations.id),
    requestType: postSaleRequestTypeEnum('request_type').notNull(),
    description: text('description').notNull(),
    assignedToUserId: uuid('assigned_to_user_id').references(() => users.id),
    status: postSaleRequestStatusEnum('status').notNull().default('OPEN'),
    resolutionDeadline: timestamp('resolution_deadline'),
    processNotes: text('process_notes'),
    registrationDate: timestamp('registration_date').notNull().defaultNow(),
    closingDate: timestamp('closing_date'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('idx_post_sale_unit').on(table.unitId),
    index('idx_post_sale_status').on(table.status),
  ],
);

export type PostSaleRequestSchema = typeof postSaleRequests.$inferSelect;
export type NewPostSaleRequestSchema = typeof postSaleRequests.$inferInsert;
