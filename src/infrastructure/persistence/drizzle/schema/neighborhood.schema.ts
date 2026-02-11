import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { cities } from './city.schema';

export const neighborhoods = pgTable(
  'neighborhood',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 200 }).notNull(),
    cityId: uuid('city_id')
      .notNull()
      .references(() => cities.id, { onDelete: 'cascade' }),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('idx_neighborhood_city').on(table.cityId),
  ],
);

export type NeighborhoodSchema = typeof neighborhoods.$inferSelect;
export type NewNeighborhoodSchema = typeof neighborhoods.$inferInsert;
