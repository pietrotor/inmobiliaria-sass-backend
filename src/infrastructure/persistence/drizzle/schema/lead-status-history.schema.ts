import { pgTable, uuid, timestamp } from 'drizzle-orm/pg-core';
import { leads, leadStatusEnum } from './lead.schema';
import { users } from './user.schema';

export const leadStatusHistory = pgTable('lead_status_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  leadId: uuid('lead_id')
    .notNull()
    .references(() => leads.id, { onDelete: 'cascade' }),
  fromStatus: leadStatusEnum('from_status').notNull(),
  toStatus: leadStatusEnum('to_status').notNull(),
  changedByUserId: uuid('changed_by_user_id')
    .notNull()
    .references(() => users.id),
  changedAt: timestamp('changed_at').notNull().defaultNow(),
});

export type LeadStatusHistorySchema = typeof leadStatusHistory.$inferSelect;
export type NewLeadStatusHistorySchema = typeof leadStatusHistory.$inferInsert;
