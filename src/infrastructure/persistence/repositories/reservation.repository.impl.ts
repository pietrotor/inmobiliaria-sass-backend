import { Injectable } from '@nestjs/common';
import { eq, and, sql, desc, count, lt, ilike } from 'drizzle-orm';

import { Reservation } from '@domain/reservation/entities/reservation.entity';
import {
  ReservationRepository,
  CreateReservationData,
  ReservationFilters,
} from '@domain/reservation/repositories/reservation.repository';
import { PaginatedResult } from '@domain/common/interfaces/paginated-result.interface';
import { DrizzleService } from '../drizzle/drizzle.service';
import { reservations } from '../drizzle/schema/reservation.schema';
import { ReservationMapper } from '../drizzle/mappers/reservation.mapper';

@Injectable()
export class DrizzleReservationRepository implements ReservationRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(data: CreateReservationData): Promise<Reservation> {
    const [created] = await this.drizzle.db
      .insert(reservations)
      .values({
        unitIds: data.unitIds as any,
        clientName: data.clientName,
        clientNationalId: data.clientNationalId,
        clientPhone: data.clientPhone,
        clientEmail: data.clientEmail ?? null,
        salesChannel: data.salesChannel as any,
        brokerId: data.brokerId ?? null,
        intentId: data.intentId ?? null,
        executiveId: data.executiveId ?? null,
        developerId: data.developerId,
        reservationPaymentAmount: data.reservationPaymentAmount,
        reservationPaymentCurrency: data.reservationPaymentCurrency,
        reservationPaymentDate: data.reservationPaymentDate,
        agreementDeadline: data.agreementDeadline ?? null,
        status: data.status as any,
      })
      .returning();
    return ReservationMapper.toDomain(created);
  }

  async findById(id: string): Promise<Reservation | null> {
    const [result] = await this.drizzle.db
      .select()
      .from(reservations)
      .where(eq(reservations.id, id));
    return result ? ReservationMapper.toDomain(result) : null;
  }

  async findByDeveloperId(
    developerId: string,
    limit: number,
    offset: number,
    filters?: ReservationFilters,
  ): Promise<PaginatedResult<Reservation>> {
    const conditions = [eq(reservations.developerId, developerId)];
    if (filters?.search) {
      conditions.push(
        ilike(reservations.clientName, `%${filters.search}%`),
      );
    }
    if (filters?.status) {
      conditions.push(eq(reservations.status, filters.status as any));
    }
    const where = and(...conditions);

    const [totalResult] = await this.drizzle.db
      .select({ count: count() })
      .from(reservations)
      .where(where);

    const results = await this.drizzle.db
      .select()
      .from(reservations)
      .where(where)
      .orderBy(desc(reservations.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      data: results.map(ReservationMapper.toDomain),
      total: totalResult?.count ?? 0,
      limit,
      offset,
    };
  }

  async findByUnitId(unitId: string): Promise<Reservation[]> {
    const results = await this.drizzle.db
      .select()
      .from(reservations)
      .where(sql`${reservations.unitIds} @> ${JSON.stringify([unitId])}::jsonb`);
    return results.map(ReservationMapper.toDomain);
  }

  async findPendingAgreementDeadlines(): Promise<Reservation[]> {
    const now = new Date();
    const results = await this.drizzle.db
      .select()
      .from(reservations)
      .where(
        and(
          eq(reservations.status, 'RESERVED' as any),
          lt(reservations.agreementDeadline, now),
        ),
      );
    return results.map(ReservationMapper.toDomain);
  }

  async update(id: string, data: Partial<Reservation>): Promise<Reservation> {
    const updateData: Record<string, unknown> = {};
    if (data.status !== undefined) updateData.status = data.status;
    if (data.agreementSignedDate !== undefined)
      updateData.agreementSignedDate = data.agreementSignedDate;
    if (data.deliveryDate !== undefined)
      updateData.deliveryDate = data.deliveryDate;
    if (data.agreementDeadline !== undefined)
      updateData.agreementDeadline = data.agreementDeadline;

    const [updated] = await this.drizzle.db
      .update(reservations)
      .set(updateData)
      .where(eq(reservations.id, id))
      .returning();
    return ReservationMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.drizzle.db
      .delete(reservations)
      .where(eq(reservations.id, id));
  }
}
