import { Injectable } from '@nestjs/common';
import { eq, and, sql, desc, count, lt } from 'drizzle-orm';

import { ReservationIntent } from '@domain/intent/entities/reservation-intent.entity';
import {
  ReservationIntentRepository,
  CreateReservationIntentData,
} from '@domain/intent/repositories/reservation-intent.repository';
import { PaginatedResult } from '@domain/common/interfaces/paginated-result.interface';
import { DrizzleService } from '../drizzle/drizzle.service';
import { reservationIntents } from '../drizzle/schema/reservation-intent.schema';
import { projects } from '../drizzle/schema/project.schema';
import { ReservationIntentMapper } from '../drizzle/mappers/reservation-intent.mapper';

@Injectable()
export class DrizzleReservationIntentRepository
  implements ReservationIntentRepository
{
  constructor(private readonly drizzle: DrizzleService) {}

  async create(data: CreateReservationIntentData): Promise<ReservationIntent> {
    const [created] = await this.drizzle.db
      .insert(reservationIntents)
      .values({
        brokerId: data.brokerId,
        projectId: data.projectId,
        unitIds: data.unitIds as any,
        clientName: data.clientName,
        clientNationalId: data.clientNationalId,
        clientPhone: data.clientPhone,
        clientEmail: data.clientEmail ?? null,
        hasFinancing: data.hasFinancing,
        hasVisited: data.hasVisited,
        status: data.status as any,
        deadlineAt: data.deadlineAt,
      })
      .returning();
    return ReservationIntentMapper.toDomain(created);
  }

  async findById(id: string): Promise<ReservationIntent | null> {
    const [result] = await this.drizzle.db
      .select()
      .from(reservationIntents)
      .where(eq(reservationIntents.id, id));
    return result ? ReservationIntentMapper.toDomain(result) : null;
  }

  async findActiveByUnitId(unitId: string): Promise<ReservationIntent | null> {
    const [result] = await this.drizzle.db
      .select()
      .from(reservationIntents)
      .where(
        and(
          eq(reservationIntents.status, 'ACTIVE' as any),
          sql`${reservationIntents.unitIds} @> ${JSON.stringify([unitId])}::jsonb`,
        ),
      );
    return result ? ReservationIntentMapper.toDomain(result) : null;
  }

  async findActiveByBrokerId(brokerId: string): Promise<ReservationIntent[]> {
    const results = await this.drizzle.db
      .select()
      .from(reservationIntents)
      .where(
        and(
          eq(reservationIntents.brokerId, brokerId),
          eq(reservationIntents.status, 'ACTIVE' as any),
        ),
      );
    return results.map(ReservationIntentMapper.toDomain);
  }

  async findByProjectId(
    projectId: string,
    limit: number,
    offset: number,
  ): Promise<PaginatedResult<ReservationIntent>> {
    const [totalResult] = await this.drizzle.db
      .select({ count: count() })
      .from(reservationIntents)
      .where(eq(reservationIntents.projectId, projectId));

    const results = await this.drizzle.db
      .select()
      .from(reservationIntents)
      .where(eq(reservationIntents.projectId, projectId))
      .orderBy(desc(reservationIntents.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      data: results.map(ReservationIntentMapper.toDomain),
      total: totalResult?.count ?? 0,
      limit,
      offset,
    };
  }

  async findByBrokerId(
    brokerId: string,
    limit: number,
    offset: number,
  ): Promise<PaginatedResult<ReservationIntent>> {
    const [totalResult] = await this.drizzle.db
      .select({ count: count() })
      .from(reservationIntents)
      .where(eq(reservationIntents.brokerId, brokerId));

    const results = await this.drizzle.db
      .select()
      .from(reservationIntents)
      .where(eq(reservationIntents.brokerId, brokerId))
      .orderBy(desc(reservationIntents.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      data: results.map(ReservationIntentMapper.toDomain),
      total: totalResult?.count ?? 0,
      limit,
      offset,
    };
  }

  async findExpiredActive(): Promise<ReservationIntent[]> {
    const now = new Date();
    const results = await this.drizzle.db
      .select()
      .from(reservationIntents)
      .where(
        and(
          eq(reservationIntents.status, 'ACTIVE' as any),
          lt(reservationIntents.deadlineAt, now),
        ),
      );
    return results.map(ReservationIntentMapper.toDomain);
  }

  async findByClientNationalId(
    nationalId: string,
    developerId: string,
    withinDays: number,
  ): Promise<ReservationIntent[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - withinDays);

    const results = await this.drizzle.db
      .select({ intent: reservationIntents })
      .from(reservationIntents)
      .innerJoin(projects, eq(reservationIntents.projectId, projects.id))
      .where(
        and(
          eq(reservationIntents.clientNationalId, nationalId),
          eq(projects.developerId, developerId),
          sql`${reservationIntents.createdAt} >= ${cutoffDate}`,
        ),
      );
    return results.map((r) => ReservationIntentMapper.toDomain(r.intent));
  }

  async update(
    id: string,
    data: Partial<ReservationIntent>,
  ): Promise<ReservationIntent> {
    const updateData: Record<string, unknown> = {};
    if (data.status !== undefined) updateData.status = data.status;
    if (data.deadlineAt !== undefined) updateData.deadlineAt = data.deadlineAt;
    if (data.pausedTimeRemainingMs !== undefined)
      updateData.pausedTimeRemainingMs = data.pausedTimeRemainingMs;
    if (data.rejectionReason !== undefined)
      updateData.rejectionReason = data.rejectionReason;
    if (data.rejectionNote !== undefined)
      updateData.rejectionNote = data.rejectionNote;

    const [updated] = await this.drizzle.db
      .update(reservationIntents)
      .set(updateData)
      .where(eq(reservationIntents.id, id))
      .returning();
    return ReservationIntentMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.drizzle.db
      .delete(reservationIntents)
      .where(eq(reservationIntents.id, id));
  }
}
