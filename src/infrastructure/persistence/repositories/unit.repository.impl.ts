import { Injectable } from '@nestjs/common';
import { eq, and, gte, lte, sql, count, desc, SQL } from 'drizzle-orm';

import { Unit } from '@domain/unit/entities/unit.entity';
import {
  UnitRepository,
  CreateUnitData,
  UnitFilters,
} from '@domain/unit/repositories/unit.repository';
import { PaginatedResult } from '@domain/common/interfaces/paginated-result.interface';
import { DrizzleService } from '../drizzle/drizzle.service';
import { units } from '../drizzle/schema/unit.schema';
import { projects } from '../drizzle/schema/project.schema';
import { UnitMapper } from '../drizzle/mappers/unit.mapper';

@Injectable()
export class DrizzleUnitRepository implements UnitRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(data: CreateUnitData): Promise<Unit> {
    return await this.drizzle.db.transaction(async (tx) => {
      const [created] = await tx
        .insert(units)
        .values({
          projectId: data.projectId,
          buildingId: data.buildingId,
          typologyId: data.typologyId,
          identifier: data.identifier,
          type: data.type,
          status: data.status,
          priceUSD: data.priceUSD,
          commissionPctOverride: data.commissionPctOverride,
          attributes: data.attributes,
          internalNotes: data.internalNotes,
        })
        .returning();

      await tx
        .update(projects)
        .set({ totalUnits: sql`${projects.totalUnits} + 1` })
        .where(eq(projects.id, data.projectId));

      return UnitMapper.toDomain(created);
    });
  }

  async createMany(data: CreateUnitData[]): Promise<number> {
    if (data.length === 0) return 0;

    const rows = data.map((d) => ({
      projectId: d.projectId,
      buildingId: d.buildingId,
      typologyId: d.typologyId,
      identifier: d.identifier,
      type: d.type,
      status: d.status,
      priceUSD: d.priceUSD,
      commissionPctOverride: d.commissionPctOverride,
      attributes: d.attributes,
      internalNotes: d.internalNotes,
    }));

    const countsByProject = rows.reduce<Record<string, number>>(
      (acc, row) => {
        acc[row.projectId] = (acc[row.projectId] ?? 0) + 1;
        return acc;
      },
      {},
    );

    await this.drizzle.db.transaction(async (tx) => {
      const BATCH_SIZE = 100;
      for (let i = 0; i < rows.length; i += BATCH_SIZE) {
        await tx.insert(units).values(rows.slice(i, i + BATCH_SIZE));
      }

      for (const [projectId, increment] of Object.entries(countsByProject)) {
        await tx
          .update(projects)
          .set({ totalUnits: sql`${projects.totalUnits} + ${increment}` })
          .where(eq(projects.id, projectId));
      }
    });

    return data.length;
  }

  async findById(id: string): Promise<Unit | null> {
    const [unit] = await this.drizzle.db
      .select()
      .from(units)
      .where(eq(units.id, id));

    return unit ? UnitMapper.toDomain(unit) : null;
  }

  async findByProjectId(
    projectId: string,
    limit: number,
    offset: number,
    filters?: UnitFilters,
  ): Promise<PaginatedResult<Unit>> {
    const conditions = this.buildWhereConditions(projectId, filters);

    const [totalResult] = await this.drizzle.db
      .select({ count: count() })
      .from(units)
      .where(and(...conditions));

    const results = await this.drizzle.db
      .select()
      .from(units)
      .where(and(...conditions))
      .orderBy(desc(units.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      data: results.map(UnitMapper.toDomain),
      total: totalResult.count,
      limit,
      offset,
    };
  }

  async update(id: string, data: Partial<Unit>): Promise<Unit> {
    const updateData: Record<string, unknown> = {};

    if (data.identifier !== undefined) updateData.identifier = data.identifier;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.priceUSD !== undefined) updateData.priceUSD = data.priceUSD;
    if (data.commissionPctOverride !== undefined)
      updateData.commissionPctOverride = data.commissionPctOverride;
    if (data.attributes !== undefined) updateData.attributes = data.attributes;
    if (data.internalNotes !== undefined)
      updateData.internalNotes = data.internalNotes;
    if (data.buildingId !== undefined) updateData.buildingId = data.buildingId;
    if (data.typologyId !== undefined) updateData.typologyId = data.typologyId;

    const [updated] = await this.drizzle.db
      .update(units)
      .set(updateData)
      .where(eq(units.id, id))
      .returning();

    return UnitMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.drizzle.db.transaction(async (tx) => {
      const [deleted] = await tx
        .delete(units)
        .where(eq(units.id, id))
        .returning({ projectId: units.projectId });

      if (!deleted) return;

      await tx
        .update(projects)
        .set({
          totalUnits: sql`GREATEST(${projects.totalUnits} - 1, 0)`,
        })
        .where(eq(projects.id, deleted.projectId));
    });
  }

  async findIdentifiersByProjectId(projectId: string): Promise<string[]> {
    const results = await this.drizzle.db
      .select({ identifier: units.identifier })
      .from(units)
      .where(eq(units.projectId, projectId));

    return results.map((r) => r.identifier);
  }

  async countByProjectId(projectId: string): Promise<number> {
    const [result] = await this.drizzle.db
      .select({ count: count() })
      .from(units)
      .where(eq(units.projectId, projectId));

    return result.count;
  }

  private buildWhereConditions(
    projectId: string,
    filters?: UnitFilters,
  ): SQL[] {
    const conditions: SQL[] = [eq(units.projectId, projectId)];

    if (filters?.status) {
      conditions.push(eq(units.status, filters.status));
    }

    if (filters?.type) {
      conditions.push(eq(units.type, filters.type));
    }

    if (filters?.minPrice !== undefined) {
      conditions.push(gte(units.priceUSD, filters.minPrice));
    }

    if (filters?.maxPrice !== undefined) {
      conditions.push(lte(units.priceUSD, filters.maxPrice));
    }

    if (filters?.floor !== undefined) {
      conditions.push(
        sql`(${units.attributes}->>'floor')::int = ${filters.floor}`,
      );
    }

    if (filters?.buildingId) {
      conditions.push(eq(units.buildingId, filters.buildingId));
    }

    if (filters?.typologyId) {
      conditions.push(eq(units.typologyId, filters.typologyId));
    }

    return conditions;
  }
}
