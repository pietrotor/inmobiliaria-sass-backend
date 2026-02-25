import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { organizations } from './organization.schema';

export const developers = pgTable(
  'developer',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    legalName: varchar('legal_name', { length: 255 }).notNull(),
    taxId: varchar('tax_id', { length: 50 }).notNull(),
    phone: varchar('phone', { length: 50 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex('developer_organization_id_idx').on(table.organizationId),
    uniqueIndex('developer_tax_id_idx').on(table.taxId),
  ],
);

export type DeveloperSchema = typeof developers.$inferSelect;
export type NewDeveloperSchema = typeof developers.$inferInsert;
