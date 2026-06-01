import { pgEnum } from 'drizzle-orm/pg-core';

export const unitStatusEnum = pgEnum('unit_status', [
  'AVAILABLE',
  'WITH_INTEREST',
  'RESERVED',
  'SOLD',
  'SUSPENDED',
  'UNAVAILABLE',
]);

export const unitTypeEnum = pgEnum('unit_type', [
  'APARTMENT',
  'OFFICE',
  'COMMERCIAL',
  'PARKING',
  'STORAGE',
  'HOUSE',
  'TOWNHOUSE',
  'LOT',
]);
