import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
  pgEnum,
  index,
} from 'drizzle-orm/pg-core';

export const entityTypeEnum = pgEnum('entity_type', [
  'PROJECT',
  'UNIT',
  'DEVELOPER',
  'USER',
]);

export const mediaTypeEnum = pgEnum('media_type', [
  'IMAGE',
  'VIDEO',
  'DOCUMENT',
]);

export const mediaRoleEnum = pgEnum('media_role', [
  'COVER',
  'GALLERY',
  'BROCHURE',
  'FLOOR_PLAN',
  'LOGO',
  'AVATAR',
]);

export const media = pgTable(
  'media',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    entityType: entityTypeEnum('entity_type').notNull(),
    entityId: uuid('entity_id').notNull(),
    mediaType: mediaTypeEnum('media_type').notNull(),
    role: mediaRoleEnum('role').notNull(),
    url: varchar('url', { length: 1000 }).notNull(),
    key: varchar('key', { length: 1000 }).notNull(),
    filename: varchar('filename', { length: 500 }).notNull(),
    mimeType: varchar('mime_type', { length: 100 }).notNull(),
    size: integer('size').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    index('idx_media_entity').on(table.entityType, table.entityId),
    index('idx_media_entity_role').on(
      table.entityType,
      table.entityId,
      table.role,
    ),
  ],
);

export type MediaSchema = typeof media.$inferSelect;
export type NewMediaSchema = typeof media.$inferInsert;
