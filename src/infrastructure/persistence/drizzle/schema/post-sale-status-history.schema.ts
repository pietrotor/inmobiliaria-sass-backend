import { pgTable, uuid, timestamp } from 'drizzle-orm/pg-core';
import {
  postSaleRequests,
  postSaleRequestStatusEnum,
} from './post-sale-request.schema';
import { users } from './user.schema';

export const postSaleStatusHistory = pgTable('post_sale_status_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  requestId: uuid('request_id')
    .notNull()
    .references(() => postSaleRequests.id, { onDelete: 'cascade' }),
  fromStatus: postSaleRequestStatusEnum('from_status').notNull(),
  toStatus: postSaleRequestStatusEnum('to_status').notNull(),
  changedByUserId: uuid('changed_by_user_id')
    .notNull()
    .references(() => users.id),
  changedAt: timestamp('changed_at').notNull().defaultNow(),
});

export type PostSaleStatusHistorySchema =
  typeof postSaleStatusHistory.$inferSelect;
export type NewPostSaleStatusHistorySchema =
  typeof postSaleStatusHistory.$inferInsert;
