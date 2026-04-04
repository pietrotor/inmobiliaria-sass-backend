import {
  pgTable,
  uuid,
  timestamp,
  pgEnum,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { brokers } from './broker.schema';
import { projects } from './project.schema';

export const brokerAccessStatusEnum = pgEnum('broker_access_status', [
  'INVITED',
  'ACCEPTED',
]);

export const brokerProjectAccess = pgTable(
  'broker_project_access',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    brokerId: uuid('broker_id')
      .notNull()
      .references(() => brokers.id, { onDelete: 'cascade' }),
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    status: brokerAccessStatusEnum('status').notNull().default('INVITED'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('broker_project_access_unique_idx').on(
      table.brokerId,
      table.projectId,
    ),
  ],
);

export type BrokerProjectAccessSchema =
  typeof brokerProjectAccess.$inferSelect;
export type NewBrokerProjectAccessSchema =
  typeof brokerProjectAccess.$inferInsert;
