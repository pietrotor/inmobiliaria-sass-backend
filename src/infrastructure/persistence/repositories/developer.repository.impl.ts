import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { Developer } from '@domain/developer/entities/developer.entity';
import {
  DeveloperRepository,
  CreateDeveloperData,
} from '@domain/developer/repositories/developer.repository';
import { DrizzleService } from '../drizzle/drizzle.service';
import { developers } from '../drizzle/schema/developer.schema';
import { DeveloperMapper } from '../drizzle/mappers/developer.mapper';

@Injectable()
export class DrizzleDeveloperRepository implements DeveloperRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(data: CreateDeveloperData): Promise<Developer> {
    const [created] = await this.drizzle.db
      .insert(developers)
      .values({
        organizationId: data.organizationId,
        name: data.name,
        legalName: data.legalName,
        taxId: data.taxId,
        phone: data.phone,
        email: data.email,
      })
      .returning();

    return DeveloperMapper.toDomain(created);
  }

  async findById(id: string): Promise<Developer | null> {
    const [developer] = await this.drizzle.db
      .select()
      .from(developers)
      .where(eq(developers.id, id));

    return developer ? DeveloperMapper.toDomain(developer) : null;
  }

  async findByOrganizationId(
    organizationId: string,
  ): Promise<Developer | null> {
    const [developer] = await this.drizzle.db
      .select()
      .from(developers)
      .where(eq(developers.organizationId, organizationId));

    return developer ? DeveloperMapper.toDomain(developer) : null;
  }

  async findAll(): Promise<Developer[]> {
    const results = await this.drizzle.db.select().from(developers);

    return results.map(DeveloperMapper.toDomain);
  }

  async update(id: string, data: Partial<Developer>): Promise<Developer> {
    const updateData: Record<string, unknown> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.legalName !== undefined) updateData.legalName = data.legalName;
    if (data.taxId !== undefined) updateData.taxId = data.taxId;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.email !== undefined) updateData.email = data.email;

    const [updated] = await this.drizzle.db
      .update(developers)
      .set(updateData)
      .where(eq(developers.id, id))
      .returning();

    return DeveloperMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.drizzle.db.delete(developers).where(eq(developers.id, id));
  }
}
