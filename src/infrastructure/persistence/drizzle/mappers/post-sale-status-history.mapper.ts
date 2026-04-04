import { PostSaleStatusHistory } from '@domain/post-sale/entities/post-sale-status-history.entity';
import { PostSaleRequestStatus } from '@domain/post-sale/value-objects/request-status.vo';
import { PostSaleStatusHistorySchema } from '../schema/post-sale-status-history.schema';

export class PostSaleStatusHistoryMapper {
  static toDomain(schema: PostSaleStatusHistorySchema): PostSaleStatusHistory {
    return new PostSaleStatusHistory({
      id: schema.id,
      requestId: schema.requestId,
      fromStatus: schema.fromStatus as PostSaleRequestStatus,
      toStatus: schema.toStatus as PostSaleRequestStatus,
      changedByUserId: schema.changedByUserId,
      changedAt: schema.changedAt,
    });
  }

  static toPersistence(
    entity: Omit<PostSaleStatusHistory, 'id' | 'changedAt'>,
  ): Omit<PostSaleStatusHistorySchema, 'id' | 'changedAt'> {
    return {
      requestId: entity.requestId,
      fromStatus: entity.fromStatus as any,
      toStatus: entity.toStatus as any,
      changedByUserId: entity.changedByUserId,
    };
  }
}
