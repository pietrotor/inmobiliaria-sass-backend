import {
  pgTable,
  uuid,
  varchar,
  real,
  timestamp,
  jsonb,
  pgEnum,
  index,
} from 'drizzle-orm/pg-core';
import { developers } from './developer.schema';
import { brokers } from './broker.schema';
import { users } from './user.schema';

export const proposalTypeEnum = pgEnum('proposal_type', ['BROKER', 'DIRECT']);

export const commercialProposals = pgTable(
  'commercial_proposal',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    type: proposalTypeEnum('type').notNull(),
    brokerId: uuid('broker_id').references(() => brokers.id),
    executiveId: uuid('executive_id').references(() => users.id),
    developerId: uuid('developer_id')
      .notNull()
      .references(() => developers.id, { onDelete: 'cascade' }),
    clientName: varchar('client_name', { length: 255 }).notNull(),
    clientNationalId: varchar('client_national_id', { length: 50 }).notNull(),
    clientPhone: varchar('client_phone', { length: 50 }).notNull(),
    clientEmail: varchar('client_email', { length: 255 }),
    units: jsonb('units').notNull(),
    totalPriceUSD: real('total_price_usd').notNull(),
    estimatedCommissionUSD: real('estimated_commission_usd').notNull(),
    generatedAt: timestamp('generated_at').notNull().defaultNow(),
    validUntil: timestamp('valid_until').notNull(),
  },
  (table) => [
    index('idx_proposal_broker').on(table.brokerId),
    index('idx_proposal_developer').on(table.developerId),
    index('idx_proposal_national_id').on(table.clientNationalId),
  ],
);

export type CommercialProposalSchema = typeof commercialProposals.$inferSelect;
export type NewCommercialProposalSchema =
  typeof commercialProposals.$inferInsert;
