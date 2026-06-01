import { Injectable } from '@nestjs/common';
import { eq, count, asc } from 'drizzle-orm';

import { Building } from '@domain/building/entities/building.entity';
import {
  BuildingRepository,
  CreateBuildingData,
} from '@domain/building/repositories/building.repository';
import { DrizzleService } from '../drizzle/drizzle.service';
import { buildings } from '../drizzle/schema/building.schema';
import { BuildingMapper } from '../drizzle/mappers/building.mapper';

@Injectable()
export class DrizzleBuildingRepository implements BuildingRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(data: CreateBuildingData): Promise<Building> {
    const [created] = await this.drizzle.db
      .insert(buildings)
      .values({
        projectId: data.projectId,
        name: data.name,
        totalFloors: data.totalFloors,
        sortOrder: data.sortOrder,
      })
      .returning();

    return BuildingMapper.toDomain(created);
  }

  async createMany(data: CreateBuildingData[]): Promise<Building[]> {
    if (data.length === 0) return [];

    const rows = data.map((d) => ({
      projectId: d.projectId,
      name: d.name,
      totalFloors: d.totalFloors,
      sortOrder: d.sortOrder,
    }));

    const created = await this.drizzle.db
      .insert(buildings)
      .values(rows)
      .returning();

    return created.map(BuildingMapper.toDomain);
  }

  async findById(id: string): Promise<Building | null> {
    const [building] = await this.drizzle.db
      .select()
      .from(buildings)
      .where(eq(buildings.id, id));

    return building ? BuildingMapper.toDomain(building) : null;
  }

  async findByProjectId(projectId: string): Promise<Building[]> {
    const results = await this.drizzle.db
      .select()
      .from(buildings)
      .where(eq(buildings.projectId, projectId))
      .orderBy(asc(buildings.sortOrder));

    return results.map(BuildingMapper.toDomain);
  }

  async update(id: string, data: Partial<Building>): Promise<Building> {
    const updateData: Record<string, unknown> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.totalFloors !== undefined) updateData.totalFloors = data.totalFloors;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

    const [updated] = await this.drizzle.db
      .update(buildings)
      .set(updateData)
      .where(eq(buildings.id, id))
      .returning();

    return BuildingMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.drizzle.db.delete(buildings).where(eq(buildings.id, id));
  }

  async countByProjectId(projectId: string): Promise<number> {
    const [result] = await this.drizzle.db
      .select({ count: count() })
      .from(buildings)
      .where(eq(buildings.projectId, projectId));

    return result.count;
  }
}
