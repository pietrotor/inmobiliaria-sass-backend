import { Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';

import { Neighborhood } from '@domain/location/entities/neighborhood.entity';
import {
  NeighborhoodRepository,
  CreateNeighborhoodData,
} from '@domain/location/repositories/neighborhood.repository';
import { DrizzleService } from '../drizzle/drizzle.service';
import { neighborhoods } from '../drizzle/schema/neighborhood.schema';
import { NeighborhoodMapper } from '../drizzle/mappers/neighborhood.mapper';

@Injectable()
export class DrizzleNeighborhoodRepository implements NeighborhoodRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(data: CreateNeighborhoodData): Promise<Neighborhood> {
    const [created] = await this.drizzle.db
      .insert(neighborhoods)
      .values({
        name: data.name,
        cityId: data.cityId,
      })
      .returning();

    return NeighborhoodMapper.toDomain(created);
  }

  async findById(id: string): Promise<Neighborhood | null> {
    const [neighborhood] = await this.drizzle.db
      .select()
      .from(neighborhoods)
      .where(eq(neighborhoods.id, id));

    return neighborhood ? NeighborhoodMapper.toDomain(neighborhood) : null;
  }

  async findByCityId(
    cityId: string,
    onlyActive = false,
  ): Promise<Neighborhood[]> {
    const conditions = [eq(neighborhoods.cityId, cityId)];
    if (onlyActive) {
      conditions.push(eq(neighborhoods.isActive, true));
    }

    const result = await this.drizzle.db
      .select()
      .from(neighborhoods)
      .where(and(...conditions));

    return result.map(NeighborhoodMapper.toDomain);
  }

  async findAll(onlyActive = false): Promise<Neighborhood[]> {
    const query = this.drizzle.db.select().from(neighborhoods);

    if (onlyActive) {
      const result = await query.where(eq(neighborhoods.isActive, true));
      return result.map(NeighborhoodMapper.toDomain);
    }

    const result = await query;
    return result.map(NeighborhoodMapper.toDomain);
  }

  async update(
    id: string,
    data: Partial<Neighborhood>,
  ): Promise<Neighborhood> {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.cityId !== undefined) updateData.cityId = data.cityId;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const [updated] = await this.drizzle.db
      .update(neighborhoods)
      .set(updateData)
      .where(eq(neighborhoods.id, id))
      .returning();

    return NeighborhoodMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.drizzle.db
      .delete(neighborhoods)
      .where(eq(neighborhoods.id, id));
  }
}
