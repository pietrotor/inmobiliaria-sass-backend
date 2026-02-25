import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const organizations = pgTable(
  'organization',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 50 }),
    address: varchar('address', { length: 500 }),
    logo: varchar('logo', { length: 1000 }),
    description: text('description'),
    website: varchar('website', { length: 500 }),
    whatsapp: varchar('whatsapp', { length: 50 }),
    instagram: varchar('instagram', { length: 255 }),
    facebook: varchar('facebook', { length: 255 }),
    primaryColor: varchar('primary_color', { length: 7 }),
    secondaryColor: varchar('secondary_color', { length: 7 }),
    timezone: varchar('timezone', { length: 100 }).default('America/Caracas'),
    defaultCurrency: varchar('default_currency', { length: 10 }).default('USD'),
    isActive: boolean('is_active').notNull().default(true),
    deleted: boolean('deleted').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex('organization_slug_idx').on(table.slug),
    uniqueIndex('organization_email_idx').on(table.email),
  ],
);

export type OrganizationSchema = typeof organizations.$inferSelect;
export type NewOrganizationSchema = typeof organizations.$inferInsert;
