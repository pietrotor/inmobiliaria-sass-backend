import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { Country } from '@domain/location/entities/country.entity';
import {
  CountryRepository,
  CreateCountryData,
} from '@domain/location/repositories/country.repository';
import { DrizzleService } from '../drizzle/drizzle.service';
import { countries } from '../drizzle/schema/country.schema';
import { CountryMapper } from '../drizzle/mappers/country.mapper';

@Injectable()
export class DrizzleCountryRepository implements CountryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(data: CreateCountryData): Promise<Country> {
    const [created] = await this.drizzle.db
      .insert(countries)
      .values({
        name: data.name,
        code: data.code.toUpperCase(),
      })
      .returning();

    return CountryMapper.toDomain(created);
  }

  async findById(id: string): Promise<Country | null> {
    const [country] = await this.drizzle.db
      .select()
      .from(countries)
      .where(eq(countries.id, id));

    return country ? CountryMapper.toDomain(country) : null;
  }

  async findByCode(code: string): Promise<Country | null> {
    const [country] = await this.drizzle.db
      .select()
      .from(countries)
      .where(eq(countries.code, code.toUpperCase()));

    return country ? CountryMapper.toDomain(country) : null;
  }

  async findAll(onlyActive = false): Promise<Country[]> {
    const query = this.drizzle.db.select().from(countries);

    if (onlyActive) {
      const result = await query.where(eq(countries.isActive, true));
      return result.map(CountryMapper.toDomain);
    }

    const result = await query;
    return result.map(CountryMapper.toDomain);
  }

  async update(id: string, data: Partial<Country>): Promise<Country> {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.code !== undefined) updateData.code = data.code.toUpperCase();
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const [updated] = await this.drizzle.db
      .update(countries)
      .set(updateData)
      .where(eq(countries.id, id))
      .returning();

    return CountryMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.drizzle.db.delete(countries).where(eq(countries.id, id));
  }
}
