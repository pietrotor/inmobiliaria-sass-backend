import {
  pgTable,
  uuid,
  numeric,
  boolean,
  timestamp,
  index,
  unique,
} from 'drizzle-orm/pg-core';
import { properties, currencyEnum } from './property.schema';

export const propertyPrices = pgTable(
  'property_price',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    propertyId: uuid('property_id')
      .notNull()
      .references(() => properties.id, { onDelete: 'cascade' }),
    currency: currencyEnum('currency').notNull(),
    price: numeric('price', { precision: 15, scale: 2 }).notNull(),
    isMain: boolean('is_main').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    index('idx_property_price_property').on(table.propertyId),
    unique('uq_property_price_currency').on(table.propertyId, table.currency),
  ],
);

export type PropertyPriceSchema = typeof propertyPrices.$inferSelect;
export type NewPropertyPriceSchema = typeof propertyPrices.$inferInsert;
