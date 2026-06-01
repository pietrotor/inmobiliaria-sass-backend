import {
  pgTable,
  uuid,
  varchar,
  real,
  text,
  integer,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core';
import { projects } from './project.schema';
import { unitTypeEnum } from './unit-enums.schema';

export const unitTypologies = pgTable('unit_typology', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  unitType: unitTypeEnum('unit_type').notNull(),
  basePriceUsd: real('base_price_usd'),
  baseAttributes: jsonb('base_attributes').notNull().default({}),
  description: text('description'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type UnitTypologySchema = typeof unitTypologies.$inferSelect;
export type NewUnitTypologySchema = typeof unitTypologies.$inferInsert;
