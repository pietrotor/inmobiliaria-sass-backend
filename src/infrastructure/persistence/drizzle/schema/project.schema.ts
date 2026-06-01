import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  real,
  doublePrecision,
  timestamp,
  pgEnum,
  jsonb,
} from 'drizzle-orm/pg-core';
import { developers } from './developer.schema';
import { countries } from './country.schema';
import { cities } from './city.schema';
import { neighborhoods } from './neighborhood.schema';

export const projectStatusEnum = pgEnum('project_status', [
  'DRAFT',
  'PUBLISHED',
  'PAUSED',
  'CLOSED',
]);

export const projectVisibilityEnum = pgEnum('project_visibility', [
  'PUBLIC',
  'PRIVATE',
]);

export const projectTypeEnum = pgEnum('project_type', [
  'VERTICAL',
  'HORIZONTAL',
]);

export const constructionPhaseEnum = pgEnum('construction_phase', [
  'PRE_LAUNCH',
  'UNDER_CONSTRUCTION',
  'NEAR_COMPLETION',
  'COMPLETED',
]);

export const projects = pgTable('project', {
  id: uuid('id').primaryKey().defaultRandom(),
  developerId: uuid('developer_id')
    .notNull()
    .references(() => developers.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  address: varchar('address', { length: 500 }).notNull(),
  countryId: uuid('country_id')
    .notNull()
    .references(() => countries.id),
  cityId: uuid('city_id')
    .notNull()
    .references(() => cities.id),
  neighborhoodId: uuid('neighborhood_id')
    .notNull()
    .references(() => neighborhoods.id),
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
  projectType: projectTypeEnum('project_type').notNull().default('VERTICAL'),
  status: projectStatusEnum('status').notNull().default('DRAFT'),
  visibility: projectVisibilityEnum('visibility').notNull().default('PUBLIC'),
  constructionPhase: constructionPhaseEnum('construction_phase')
    .notNull()
    .default('PRE_LAUNCH'),
  deliveryDate: timestamp('delivery_date'),
  totalFloors: integer('total_floors'),
  totalUnits: integer('total_units').notNull().default(0),
  amenities: jsonb('amenities').notNull().default([]),
  customAmenities: jsonb('custom_amenities').notNull().default([]),
  defaultCommissionPct: real('default_commission_pct').notNull().default(2.5),
  intentDeadlineHours: integer('intent_deadline_hours').notNull().default(48),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  publishedAt: timestamp('published_at'),
  closedAt: timestamp('closed_at'),
});

export type ProjectSchema = typeof projects.$inferSelect;
export type NewProjectSchema = typeof projects.$inferInsert;
