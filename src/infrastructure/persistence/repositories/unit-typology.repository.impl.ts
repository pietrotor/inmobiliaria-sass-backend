import { Injectable } from '@nestjs/common';
import { eq, asc, sql, count } from 'drizzle-orm';

import { UnitTypology } from '@domain/unit-typology/entities/unit-typology.entity';
import {
  UnitTypologyRepository,
  UnitTypologyWithCount,
  CreateUnitTypologyData,
} from '@domain/unit-typology/repositories/unit-typology.repository';
import { DrizzleService } from '../drizzle/drizzle.service';
import { unitTypologies } from '../drizzle/schema/unit-typology.schema';
import { units } from '../drizzle/schema/unit.schema';
import { UnitTypologyMapper } from '../drizzle/mappers/unit-typology.mapper';

@Injectable()
export class DrizzleUnitTypologyRepository implements UnitTypologyRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(data: CreateUnitTypologyData): Promise<UnitTypology> {
    const [created] = await this.drizzle.db
      .insert(unitTypologies)
      .values({
        projectId: data.projectId,
        name: data.name,
        unitType: data.unitType,
        basePriceUsd: data.basePriceUsd,
        baseAttributes: data.baseAttributes,
        description: data.description,
        sortOrder: data.sortOrder,
      })
      .returning();

    return UnitTypologyMapper.toDomain(created);
  }

  async findById(id: string): Promise<UnitTypology | null> {
    const [typology] = await this.drizzle.db
      .select()
      .from(unitTypologies)
      .where(eq(unitTypologies.id, id));

    return typology ? UnitTypologyMapper.toDomain(typology) : null;
  }

  async findByProjectId(projectId: string): Promise<UnitTypology[]> {
    const results = await this.drizzle.db
      .select()
      .from(unitTypologies)
      .where(eq(unitTypologies.projectId, projectId))
      .orderBy(asc(unitTypologies.sortOrder));

    return results.map(UnitTypologyMapper.toDomain);
  }

  async findByProjectIdWithUnitCount(
    projectId: string,
  ): Promise<UnitTypologyWithCount[]> {
    const rows = await this.drizzle.db
      .select({
        typology: unitTypologies,
        unitCount: sql<number>`cast(count(${units.id}) as int)`,
      })
      .from(unitTypologies)
      .leftJoin(units, eq(units.typologyId, unitTypologies.id))
      .where(eq(unitTypologies.projectId, projectId))
      .groupBy(unitTypologies.id)
      .orderBy(asc(unitTypologies.sortOrder));

    return rows.map((row) => ({
      ...UnitTypologyMapper.toDomain(row.typology),
      unitCount: row.unitCount ?? 0,
    }));
  }

  async update(
    id: string,
    data: Partial<UnitTypology>,
  ): Promise<UnitTypology> {
    const updateData: Record<string, unknown> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.unitType !== undefined) updateData.unitType = data.unitType;
    if (data.basePriceUsd !== undefined)
      updateData.basePriceUsd = data.basePriceUsd;
    if (data.baseAttributes !== undefined)
      updateData.baseAttributes = data.baseAttributes;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

    const [updated] = await this.drizzle.db
      .update(unitTypologies)
      .set(updateData)
      .where(eq(unitTypologies.id, id))
      .returning();

    return UnitTypologyMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.drizzle.db
      .delete(unitTypologies)
      .where(eq(unitTypologies.id, id));
  }
}
