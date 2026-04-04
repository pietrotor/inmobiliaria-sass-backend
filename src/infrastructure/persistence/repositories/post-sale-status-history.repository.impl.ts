import { Injectable } from '@nestjs/common';
import { eq, desc } from 'drizzle-orm';

import { PostSaleStatusHistory } from '@domain/post-sale/entities/post-sale-status-history.entity';
import {
  PostSaleStatusHistoryRepository,
  CreatePostSaleStatusHistoryData,
} from '@domain/post-sale/repositories/post-sale-status-history.repository';
import { DrizzleService } from '../drizzle/drizzle.service';
import { postSaleStatusHistory } from '../drizzle/schema/post-sale-status-history.schema';
import { PostSaleStatusHistoryMapper } from '../drizzle/mappers/post-sale-status-history.mapper';

@Injectable()
export class DrizzlePostSaleStatusHistoryRepository
  implements PostSaleStatusHistoryRepository
{
  constructor(private readonly drizzle: DrizzleService) {}

  async create(
    data: CreatePostSaleStatusHistoryData,
  ): Promise<PostSaleStatusHistory> {
    const [created] = await this.drizzle.db
      .insert(postSaleStatusHistory)
      .values({
        requestId: data.requestId,
        fromStatus: data.fromStatus as any,
        toStatus: data.toStatus as any,
        changedByUserId: data.changedByUserId,
      })
      .returning();
    return PostSaleStatusHistoryMapper.toDomain(created);
  }

  async findByRequestId(
    requestId: string,
  ): Promise<PostSaleStatusHistory[]> {
    const results = await this.drizzle.db
      .select()
      .from(postSaleStatusHistory)
      .where(eq(postSaleStatusHistory.requestId, requestId))
      .orderBy(desc(postSaleStatusHistory.changedAt));
    return results.map(PostSaleStatusHistoryMapper.toDomain);
  }
}
