import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { countries } from './country.schema';

export const cities = pgTable(
  'city',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 150 }).notNull(),
    countryId: uuid('country_id')
      .notNull()
      .references(() => countries.id, { onDelete: 'cascade' }),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('idx_city_country').on(table.countryId),
  ],
);

export type CitySchema = typeof cities.$inferSelect;
export type NewCitySchema = typeof cities.$inferInsert;
