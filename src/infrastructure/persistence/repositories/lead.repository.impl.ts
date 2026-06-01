import { Injectable } from '@nestjs/common';
import { eq, and, desc, count, ilike, or } from 'drizzle-orm';

import { Lead } from '@domain/lead/entities/lead.entity';
import {
  LeadRepository,
  CreateLeadData,
  LeadFilters,
} from '@domain/lead/repositories/lead.repository';
import { PaginatedResult } from '@domain/common/interfaces/paginated-result.interface';
import { DrizzleService } from '../drizzle/drizzle.service';
import { leads } from '../drizzle/schema/lead.schema';
import { LeadMapper } from '../drizzle/mappers/lead.mapper';

@Injectable()
export class DrizzleLeadRepository implements LeadRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(data: CreateLeadData): Promise<Lead> {
    const [created] = await this.drizzle.db
      .insert(leads)
      .values({
        developerId: data.developerId,
        assignedExecutiveId: data.assignedExecutiveId,
        fullName: data.fullName,
        nationalId: data.nationalId,
        phone: data.phone,
        email: data.email ?? null,
        source: data.source as any,
        status: data.status as any,
        interestedUnitIds: data.interestedUnitIds as any,
        notes: data.notes ?? null,
      })
      .returning();
    return LeadMapper.toDomain(created);
  }

  async findById(id: string): Promise<Lead | null> {
    const [result] = await this.drizzle.db
      .select()
      .from(leads)
      .where(eq(leads.id, id));
    return result ? LeadMapper.toDomain(result) : null;
  }

  async findByDeveloperId(
    developerId: string,
    limit: number,
    offset: number,
    filters?: LeadFilters,
  ): Promise<PaginatedResult<Lead>> {
    const conditions = [eq(leads.developerId, developerId)];

    if (filters?.status) {
      conditions.push(eq(leads.status, filters.status as any));
    }
    if (filters?.assignedExecutiveId) {
      conditions.push(
        eq(leads.assignedExecutiveId, filters.assignedExecutiveId),
      );
    }
    if (filters?.nationalId) {
      conditions.push(eq(leads.nationalId, filters.nationalId));
    }
    if (filters?.search) {
      const pattern = `%${filters.search}%`;
      conditions.push(
        or(ilike(leads.fullName, pattern), ilike(leads.phone, pattern)),
      );
    }

    const where = and(...conditions);

    const [totalResult] = await this.drizzle.db
      .select({ count: count() })
      .from(leads)
      .where(where);

    const results = await this.drizzle.db
      .select()
      .from(leads)
      .where(where)
      .orderBy(desc(leads.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      data: results.map(LeadMapper.toDomain),
      total: totalResult?.count ?? 0,
      limit,
      offset,
    };
  }

  async findByNationalIdAndDeveloper(
    nationalId: string,
    developerId: string,
  ): Promise<Lead | null> {
    const [result] = await this.drizzle.db
      .select()
      .from(leads)
      .where(
        and(
          eq(leads.nationalId, nationalId),
          eq(leads.developerId, developerId),
        ),
      );
    return result ? LeadMapper.toDomain(result) : null;
  }

  async update(id: string, data: Partial<Lead>): Promise<Lead> {
    const updateData: Record<string, unknown> = {};
    if (data.assignedExecutiveId !== undefined)
      updateData.assignedExecutiveId = data.assignedExecutiveId;
    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    if (data.nationalId !== undefined) updateData.nationalId = data.nationalId;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.source !== undefined) updateData.source = data.source;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.interestedUnitIds !== undefined)
      updateData.interestedUnitIds = data.interestedUnitIds;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const [updated] = await this.drizzle.db
      .update(leads)
      .set(updateData)
      .where(eq(leads.id, id))
      .returning();
    return LeadMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.drizzle.db.delete(leads).where(eq(leads.id, id));
  }
}
