import { Injectable } from '@nestjs/common';
import { eq, and, desc, count } from 'drizzle-orm';

import { Commission } from '@domain/commission/entities/commission.entity';
import {
  CommissionRepository,
  CreateCommissionData,
  CommissionFilters,
} from '@domain/commission/repositories/commission.repository';
import { PaginatedResult } from '@domain/common/interfaces/paginated-result.interface';
import { DrizzleService } from '../drizzle/drizzle.service';
import { commissions } from '../drizzle/schema/commission.schema';
import { CommissionMapper } from '../drizzle/mappers/commission.mapper';

@Injectable()
export class DrizzleCommissionRepository implements CommissionRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(data: CreateCommissionData): Promise<Commission> {
    const [created] = await this.drizzle.db
      .insert(commissions)
      .values({
        brokerId: data.brokerId,
        intentId: data.intentId,
        reservationId: data.reservationId,
        developerId: data.developerId,
        units: data.units,
        totalAmountUSD: data.totalAmountUSD,
        status: data.status as any,
      })
      .returning();
    return CommissionMapper.toDomain(created);
  }

  async findById(id: string): Promise<Commission | null> {
    const [result] = await this.drizzle.db
      .select()
      .from(commissions)
      .where(eq(commissions.id, id));
    return result ? CommissionMapper.toDomain(result) : null;
  }

  async findByBrokerId(
    brokerId: string,
    limit: number,
    offset: number,
    filters?: CommissionFilters,
  ): Promise<PaginatedResult<Commission>> {
    const whereClause =
      filters?.status !== undefined
        ? and(
            eq(commissions.brokerId, brokerId),
            eq(commissions.status, filters.status as any),
          )
        : eq(commissions.brokerId, brokerId);

    const [totalResult] = await this.drizzle.db
      .select({ count: count() })
      .from(commissions)
      .where(whereClause);

    const results = await this.drizzle.db
      .select()
      .from(commissions)
      .where(whereClause)
      .orderBy(desc(commissions.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      data: results.map(CommissionMapper.toDomain),
      total: totalResult?.count ?? 0,
      limit,
      offset,
    };
  }

  async findByDeveloperId(
    developerId: string,
    limit: number,
    offset: number,
    filters?: CommissionFilters,
  ): Promise<PaginatedResult<Commission>> {
    const whereClause =
      filters?.status !== undefined
        ? and(
            eq(commissions.developerId, developerId),
            eq(commissions.status, filters.status as any),
          )
        : eq(commissions.developerId, developerId);

    const [totalResult] = await this.drizzle.db
      .select({ count: count() })
      .from(commissions)
      .where(whereClause);

    const results = await this.drizzle.db
      .select()
      .from(commissions)
      .where(whereClause)
      .orderBy(desc(commissions.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      data: results.map(CommissionMapper.toDomain),
      total: totalResult?.count ?? 0,
      limit,
      offset,
    };
  }

  async update(id: string, data: Partial<Commission>): Promise<Commission> {
    const updateData: Record<string, unknown> = {};
    if (data.status !== undefined) updateData.status = data.status;
    if (data.paidAt !== undefined) updateData.paidAt = data.paidAt;
    if (data.paidByUserId !== undefined)
      updateData.paidByUserId = data.paidByUserId;
    if (data.disputeNote !== undefined)
      updateData.disputeNote = data.disputeNote;

    const [updated] = await this.drizzle.db
      .update(commissions)
      .set(updateData)
      .where(eq(commissions.id, id))
      .returning();
    return CommissionMapper.toDomain(updated);
  }
}
