import { Injectable } from '@nestjs/common';
import { eq, and, sql, desc, count } from 'drizzle-orm';

import { PostSaleRequest } from '@domain/post-sale/entities/post-sale-request.entity';
import {
  PostSaleRequestRepository,
  CreatePostSaleRequestData,
  PostSaleFilters,
} from '@domain/post-sale/repositories/post-sale-request.repository';
import { PaginatedResult } from '@domain/common/interfaces/paginated-result.interface';
import { DrizzleService } from '../drizzle/drizzle.service';
import { postSaleRequests } from '../drizzle/schema/post-sale-request.schema';
import { reservations } from '../drizzle/schema/reservation.schema';
import { PostSaleRequestMapper } from '../drizzle/mappers/post-sale-request.mapper';

@Injectable()
export class DrizzlePostSaleRequestRepository
  implements PostSaleRequestRepository
{
  constructor(private readonly drizzle: DrizzleService) {}

  async create(data: CreatePostSaleRequestData): Promise<PostSaleRequest> {
    const [created] = await this.drizzle.db
      .insert(postSaleRequests)
      .values({
        unitId: data.unitId,
        reservationId: data.reservationId,
        requestType: data.requestType as any,
        description: data.description,
        assignedToUserId: data.assignedToUserId ?? null,
        status: data.status as any,
        resolutionDeadline: data.resolutionDeadline ?? null,
        registrationDate: data.registrationDate,
      })
      .returning();
    return PostSaleRequestMapper.toDomain(created);
  }

  async findById(id: string): Promise<PostSaleRequest | null> {
    const [result] = await this.drizzle.db
      .select()
      .from(postSaleRequests)
      .where(eq(postSaleRequests.id, id));
    return result ? PostSaleRequestMapper.toDomain(result) : null;
  }

  async findByUnitId(
    unitId: string,
    limit: number,
    offset: number,
    filters?: PostSaleFilters,
  ): Promise<PaginatedResult<PostSaleRequest>> {
    const conditions = [eq(postSaleRequests.unitId, unitId)];
    if (filters?.status !== undefined) {
      conditions.push(eq(postSaleRequests.status, filters.status as any));
    }
    if (filters?.requestType !== undefined) {
      conditions.push(
        eq(postSaleRequests.requestType, filters.requestType as any),
      );
    }
    const whereClause =
      conditions.length === 1 ? conditions[0] : and(...conditions);

    const [totalResult] = await this.drizzle.db
      .select({ count: count() })
      .from(postSaleRequests)
      .where(whereClause);

    const results = await this.drizzle.db
      .select()
      .from(postSaleRequests)
      .where(whereClause)
      .orderBy(desc(postSaleRequests.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      data: results.map(PostSaleRequestMapper.toDomain),
      total: totalResult?.count ?? 0,
      limit,
      offset,
    };
  }

  async findByDeveloperId(
    developerId: string,
    limit: number,
    offset: number,
  ): Promise<PaginatedResult<PostSaleRequest>> {
    const [totalResult] = await this.drizzle.db
      .select({ count: count() })
      .from(postSaleRequests)
      .innerJoin(
        reservations,
        eq(postSaleRequests.reservationId, reservations.id),
      )
      .where(eq(reservations.developerId, developerId));

    const results = await this.drizzle.db
      .select({ request: postSaleRequests })
      .from(postSaleRequests)
      .innerJoin(
        reservations,
        eq(postSaleRequests.reservationId, reservations.id),
      )
      .where(eq(reservations.developerId, developerId))
      .orderBy(desc(postSaleRequests.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      data: results.map((r) => PostSaleRequestMapper.toDomain(r.request)),
      total: totalResult?.count ?? 0,
      limit,
      offset,
    };
  }

  async findStale(staleDays: number): Promise<PostSaleRequest[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - staleDays);

    const results = await this.drizzle.db
      .select()
      .from(postSaleRequests)
      .where(
        and(
          sql`${postSaleRequests.status} != 'CLOSED'`,
          sql`${postSaleRequests.updatedAt} < ${cutoffDate}`,
        ),
      );
    return results.map(PostSaleRequestMapper.toDomain);
  }

  async update(
    id: string,
    data: Partial<PostSaleRequest>,
  ): Promise<PostSaleRequest> {
    const updateData: Record<string, unknown> = {};
    if (data.status !== undefined) updateData.status = data.status;
    if (data.assignedToUserId !== undefined)
      updateData.assignedToUserId = data.assignedToUserId;
    if (data.processNotes !== undefined)
      updateData.processNotes = data.processNotes;
    if (data.resolutionDeadline !== undefined)
      updateData.resolutionDeadline = data.resolutionDeadline;
    if (data.closingDate !== undefined)
      updateData.closingDate = data.closingDate;

    const [updated] = await this.drizzle.db
      .update(postSaleRequests)
      .set(updateData)
      .where(eq(postSaleRequests.id, id))
      .returning();
    return PostSaleRequestMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.drizzle.db
      .delete(postSaleRequests)
      .where(eq(postSaleRequests.id, id));
  }
}
