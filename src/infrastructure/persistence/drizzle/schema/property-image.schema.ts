import {
  pgTable,
  uuid,
  varchar,
  boolean,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core';
import { properties } from './property.schema';

export const propertyImages = pgTable('property_image', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id')
    .notNull()
    .references(() => properties.id, { onDelete: 'cascade' }),
  url: varchar('url', { length: 1000 }).notNull(),
  altText: varchar('alt_text', { length: 255 }),
  order: integer('order').notNull().default(0),
  isPrimary: boolean('is_primary').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type PropertyImageSchema = typeof propertyImages.$inferSelect;
export type NewPropertyImageSchema = typeof propertyImages.$inferInsert;
