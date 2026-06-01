import {
  pgTable,
  uuid,
  varchar,
  real,
  text,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core';
import { projects } from './project.schema';
import { buildings } from './building.schema';
import { unitTypologies } from './unit-typology.schema';
import { unitStatusEnum, unitTypeEnum } from './unit-enums.schema';

export { unitStatusEnum, unitTypeEnum };

export const units = pgTable('unit', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  buildingId: uuid('building_id').references(() => buildings.id, {
    onDelete: 'cascade',
  }),
  typologyId: uuid('typology_id')
    .notNull()
    .references(() => unitTypologies.id, { onDelete: 'restrict' }),
  identifier: varchar('identifier', { length: 100 }).notNull(),
  type: unitTypeEnum('type').notNull(),
  status: unitStatusEnum('status').notNull().default('AVAILABLE'),
  priceUSD: real('price_usd').notNull(),
  commissionPctOverride: real('commission_pct_override'),
  attributes: jsonb('attributes').notNull().default({}),
  internalNotes: text('internal_notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type UnitSchema = typeof units.$inferSelect;
export type NewUnitSchema = typeof units.$inferInsert;
