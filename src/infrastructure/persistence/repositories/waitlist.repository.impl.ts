import { Injectable } from '@nestjs/common';
import { eq, and, sql, asc, lt } from 'drizzle-orm';

import { Waitlist } from '@domain/intent/entities/waitlist.entity';
import {
  WaitlistRepository,
  CreateWaitlistData,
} from '@domain/intent/repositories/waitlist.repository';
import { DrizzleService } from '../drizzle/drizzle.service';
import { waitlists } from '../drizzle/schema/waitlist.schema';
import { WaitlistMapper } from '../drizzle/mappers/waitlist.mapper';

@Injectable()
export class DrizzleWaitlistRepository implements WaitlistRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(data: CreateWaitlistData): Promise<Waitlist> {
    const [created] = await this.drizzle.db
      .insert(waitlists)
      .values({
        unitId: data.unitId,
        brokerId: data.brokerId,
        position: data.position,
        status: data.status as any,
      })
      .returning();
    return WaitlistMapper.toDomain(created);
  }

  async findById(id: string): Promise<Waitlist | null> {
    const [result] = await this.drizzle.db
      .select()
      .from(waitlists)
      .where(eq(waitlists.id, id));
    return result ? WaitlistMapper.toDomain(result) : null;
  }

  async findByUnitId(unitId: string): Promise<Waitlist[]> {
    const results = await this.drizzle.db
      .select()
      .from(waitlists)
      .where(eq(waitlists.unitId, unitId))
      .orderBy(asc(waitlists.position));
    return results.map(WaitlistMapper.toDomain);
  }

  async findNextWaiting(unitId: string): Promise<Waitlist | null> {
    const [result] = await this.drizzle.db
      .select()
      .from(waitlists)
      .where(
        and(
          eq(waitlists.unitId, unitId),
          eq(waitlists.status, 'WAITING' as any),
        ),
      )
      .orderBy(asc(waitlists.position))
      .limit(1);
    return result ? WaitlistMapper.toDomain(result) : null;
  }

  async findByBrokerId(brokerId: string): Promise<Waitlist[]> {
    const results = await this.drizzle.db
      .select()
      .from(waitlists)
      .where(eq(waitlists.brokerId, brokerId));
    return results.map(WaitlistMapper.toDomain);
  }

  async findExpiredNotified(): Promise<Waitlist[]> {
    const now = new Date();
    const results = await this.drizzle.db
      .select()
      .from(waitlists)
      .where(
        and(
          eq(waitlists.status, 'NOTIFIED' as any),
          lt(waitlists.expiresAt, now),
        ),
      );
    return results.map(WaitlistMapper.toDomain);
  }

  async getMaxPosition(unitId: string): Promise<number> {
    const [result] = await this.drizzle.db
      .select({ max: sql<number>`coalesce(max(${waitlists.position}), 0)::int` })
      .from(waitlists)
      .where(eq(waitlists.unitId, unitId));
    return result?.max ?? 0;
  }

  async update(id: string, data: Partial<Waitlist>): Promise<Waitlist> {
    const updateData: Record<string, unknown> = {};
    if (data.status !== undefined) updateData.status = data.status;
    if (data.notifiedAt !== undefined) updateData.notifiedAt = data.notifiedAt;
    if (data.expiresAt !== undefined) updateData.expiresAt = data.expiresAt;

    const [updated] = await this.drizzle.db
      .update(waitlists)
      .set(updateData)
      .where(eq(waitlists.id, id))
      .returning();
    return WaitlistMapper.toDomain(updated);
  }

  async discardAllByUnitId(unitId: string): Promise<void> {
    await this.drizzle.db
      .update(waitlists)
      .set({ status: 'DISCARDED' as any })
      .where(
        and(
          eq(waitlists.unitId, unitId),
          eq(waitlists.status, 'WAITING' as any),
        ),
      );
  }

  async delete(id: string): Promise<void> {
    await this.drizzle.db.delete(waitlists).where(eq(waitlists.id, id));
  }
}
