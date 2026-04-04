import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
  jsonb,
  index,
} from 'drizzle-orm/pg-core';
import { developers } from './developer.schema';
import { users } from './user.schema';

export const leadStatusEnum = pgEnum('lead_status', [
  'NEW',
  'CONTACTED',
  'VISITED',
  'QUOTED',
  'RESERVED',
  'LOST',
]);

export const leadSourceEnum = pgEnum('lead_source', [
  'WALK_IN',
  'PHONE',
  'SOCIAL_MEDIA',
  'REFERRAL',
  'WEBSITE',
  'OTHER',
]);

export const leads = pgTable(
  'lead',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    developerId: uuid('developer_id')
      .notNull()
      .references(() => developers.id, { onDelete: 'cascade' }),
    assignedExecutiveId: uuid('assigned_executive_id').references(
      () => users.id,
    ),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    nationalId: varchar('national_id', { length: 50 }).notNull(),
    phone: varchar('phone', { length: 50 }).notNull(),
    email: varchar('email', { length: 255 }),
    source: leadSourceEnum('source').notNull(),
    status: leadStatusEnum('status').notNull().default('NEW'),
    interestedUnitIds: jsonb('interested_unit_ids').notNull().default([]),
    notes: text('notes'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('idx_lead_developer').on(table.developerId),
    index('idx_lead_national_id').on(table.nationalId),
    index('idx_lead_executive').on(table.assignedExecutiveId),
  ],
);

export type LeadSchema = typeof leads.$inferSelect;
export type NewLeadSchema = typeof leads.$inferInsert;
