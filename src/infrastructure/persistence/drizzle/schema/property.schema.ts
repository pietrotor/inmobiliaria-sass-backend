import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  pgEnum,
  integer,
  numeric,
  doublePrecision,
  index,
} from 'drizzle-orm/pg-core';
import { organizations } from './organization.schema';
import { users } from './user.schema';
import { countries } from './country.schema';
import { cities } from './city.schema';
import { neighborhoods } from './neighborhood.schema';

export const propertyTypeEnum = pgEnum('property_type', [
  'HOUSE',
  'APARTMENT',
  'LAND',
  'COMMERCIAL',
  'OFFICE',
  'WAREHOUSE',
  'GARAGE',
  'BUILDING',
  'COUNTRY_HOUSE',
  'FARM',
  'STUDIO',
  'PENTHOUSE',
  'DUPLEX',
  'TRIPLEX',
  'LOFT',
  'OTHER',
]);

export const transactionTypeEnum = pgEnum('transaction_type', [
  'SALE',
  'RENT',
  'TEMPORARY_RENT',
]);

export const propertyStatusEnum = pgEnum('property_status', [
  'DRAFT',
  'ACTIVE',
  'PAUSED',
  'SOLD',
  'RENTED',
  'RESERVED',
  'INACTIVE',
]);

export const currencyEnum = pgEnum('currency', [
  'USD',
  'VES',
  'ARS',
  'EUR',
  'BRL',
  'CLP',
  'COP',
  'MXN',
  'PEN',
  'UYU',
]);

export const propertyConditionEnum = pgEnum('property_condition', [
  'NEW',
  'USED',
  'UNDER_CONSTRUCTION',
  'REMODELED',
  'TO_REMODEL',
]);

export const properties = pgTable(
  'property',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),

    // Basic info
    title: varchar('title', { length: 500 }).notNull(),
    slug: varchar('slug', { length: 600 }).notNull().unique(),
    propertyType: propertyTypeEnum('property_type').notNull(),
    transactionType: transactionTypeEnum('transaction_type').notNull(),
    status: propertyStatusEnum('status').notNull().default('DRAFT'),
    internalCode: varchar('internal_code', { length: 100 }),

    // Main price (denormalized from property_prices for efficient sorting/filtering)
    currency: currencyEnum('currency').notNull().default('USD'),
    price: numeric('price', { precision: 15, scale: 2 }).notNull(),
    previousPrice: numeric('previous_price', { precision: 15, scale: 2 }),
    maintenanceFee: numeric('maintenance_fee', { precision: 12, scale: 2 }),
    pricePerSqm: numeric('price_per_sqm', { precision: 12, scale: 2 }),

    // Descriptions
    description: text('description'),
    shortDescription: varchar('short_description', { length: 1000 }),
    privateNotes: text('private_notes'),

    // Location (FK to location tables)
    countryId: uuid('country_id').references(() => countries.id, {
      onDelete: 'set null',
    }),
    cityId: uuid('city_id').references(() => cities.id, {
      onDelete: 'set null',
    }),
    neighborhoodId: uuid('neighborhood_id').references(() => neighborhoods.id, {
      onDelete: 'set null',
    }),
    address: varchar('address', { length: 500 }),
    streetNumber: varchar('street_number', { length: 20 }),
    floor: varchar('floor', { length: 10 }),
    apartment: varchar('apartment', { length: 20 }),
    zipCode: varchar('zip_code', { length: 20 }),
    latitude: doublePrecision('latitude'),
    longitude: doublePrecision('longitude'),

    // Physical characteristics
    totalArea: numeric('total_area', { precision: 10, scale: 2 }),
    coveredArea: numeric('covered_area', { precision: 10, scale: 2 }),
    landArea: numeric('land_area', { precision: 10, scale: 2 }),
    bedrooms: integer('bedrooms'),
    bathrooms: integer('bathrooms'),
    halfBathrooms: integer('half_bathrooms'),
    garages: integer('garages'),
    parkingSpaces: integer('parking_spaces'),
    stories: integer('stories'),
    yearBuilt: integer('year_built'),
    condition: propertyConditionEnum('condition'),
    orientation: varchar('orientation', { length: 50 }),
    disposition: varchar('disposition', { length: 50 }),

    // Amenities / features
    hasPool: boolean('has_pool').default(false),
    hasGarden: boolean('has_garden').default(false),
    hasTerrace: boolean('has_terrace').default(false),
    hasBalcony: boolean('has_balcony').default(false),
    hasAirConditioning: boolean('has_air_conditioning').default(false),
    hasHeating: boolean('has_heating').default(false),
    hasCentralHeating: boolean('has_central_heating').default(false),
    hasFireplace: boolean('has_fireplace').default(false),
    hasClosets: boolean('has_closets').default(false),
    hasLaundryRoom: boolean('has_laundry_room').default(false),
    hasSecurity: boolean('has_security').default(false),
    hasElevator: boolean('has_elevator').default(false),
    hasGym: boolean('has_gym').default(false),
    hasPetsAllowed: boolean('has_pets_allowed').default(false),
    isFurnished: boolean('is_furnished').default(false),
    hasRooftop: boolean('has_rooftop').default(false),
    hasGrill: boolean('has_grill').default(false),
    hasSolarPanels: boolean('has_solar_panels').default(false),
    hasWaterTank: boolean('has_water_tank').default(false),
    hasServiceRoom: boolean('has_service_room').default(false),

    // SEO & web
    metaTitle: varchar('meta_title', { length: 200 }),
    metaDescription: varchar('meta_description', { length: 500 }),
    keywords: text('keywords').array(),
    videoUrl: varchar('video_url', { length: 500 }),
    virtualTourUrl: varchar('virtual_tour_url', { length: 500 }),

    // Contact / agent
    agentId: uuid('agent_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    contactPhone: varchar('contact_phone', { length: 50 }),
    contactEmail: varchar('contact_email', { length: 255 }),
    contactWhatsapp: varchar('contact_whatsapp', { length: 50 }),

    // Control
    isFeatured: boolean('is_featured').notNull().default(false),
    isPublished: boolean('is_published').notNull().default(false),
    publishedAt: timestamp('published_at'),
    expiresAt: timestamp('expires_at'),
    viewCount: integer('view_count').notNull().default(0),

    // Audit
    deleted: boolean('deleted').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('idx_property_organization').on(table.organizationId),
    index('idx_property_status_published_deleted').on(
      table.status,
      table.isPublished,
      table.deleted,
    ),
    index('idx_property_type').on(table.propertyType),
    index('idx_property_transaction').on(table.transactionType),
    index('idx_property_country').on(table.countryId),
    index('idx_property_city').on(table.cityId),
    index('idx_property_neighborhood').on(table.neighborhoodId),
    index('idx_property_price').on(table.price),
    index('idx_property_featured').on(table.isFeatured),
    index('idx_property_agent').on(table.agentId),
  ],
);

export type PropertySchema = typeof properties.$inferSelect;
export type NewPropertySchema = typeof properties.$inferInsert;
