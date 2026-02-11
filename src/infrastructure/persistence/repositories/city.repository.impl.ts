import { Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';

import { City } from '@domain/location/entities/city.entity';
import {
  CityRepository,
  CreateCityData,
} from '@domain/location/repositories/city.repository';
import { DrizzleService } from '../drizzle/drizzle.service';
import { cities } from '../drizzle/schema/city.schema';
import { CityMapper } from '../drizzle/mappers/city.mapper';

@Injectable()
export class DrizzleCityRepository implements CityRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(data: CreateCityData): Promise<City> {
    const [created] = await this.drizzle.db
      .insert(cities)
      .values({
        name: data.name,
        countryId: data.countryId,
      })
      .returning();

    return CityMapper.toDomain(created);
  }

  async findById(id: string): Promise<City | null> {
    const [city] = await this.drizzle.db
      .select()
      .from(cities)
      .where(eq(cities.id, id));

    return city ? CityMapper.toDomain(city) : null;
  }

  async findByCountryId(
    countryId: string,
    onlyActive = false,
  ): Promise<City[]> {
    const conditions = [eq(cities.countryId, countryId)];
    if (onlyActive) {
      conditions.push(eq(cities.isActive, true));
    }

    const result = await this.drizzle.db
      .select()
      .from(cities)
      .where(and(...conditions));

    return result.map(CityMapper.toDomain);
  }

  async findAll(onlyActive = false): Promise<City[]> {
    const query = this.drizzle.db.select().from(cities);

    if (onlyActive) {
      const result = await query.where(eq(cities.isActive, true));
      return result.map(CityMapper.toDomain);
    }

    const result = await query;
    return result.map(CityMapper.toDomain);
  }

  async update(id: string, data: Partial<City>): Promise<City> {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.countryId !== undefined) updateData.countryId = data.countryId;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const [updated] = await this.drizzle.db
      .update(cities)
      .set(updateData)
      .where(eq(cities.id, id))
      .returning();

    return CityMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.drizzle.db.delete(cities).where(eq(cities.id, id));
  }
}
