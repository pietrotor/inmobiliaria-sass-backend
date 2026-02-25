import { Injectable } from '@nestjs/common';
import { eq, count, desc } from 'drizzle-orm';

import { Project } from '@domain/project/entities/project.entity';
import {
  ProjectRepository,
  CreateProjectData,
} from '@domain/project/repositories/project.repository';
import { PaginatedResult } from '@domain/common/interfaces/paginated-result.interface';
import { DrizzleService } from '../drizzle/drizzle.service';
import { projects } from '../drizzle/schema/project.schema';
import { ProjectMapper } from '../drizzle/mappers/project.mapper';

@Injectable()
export class DrizzleProjectRepository implements ProjectRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(data: CreateProjectData): Promise<Project> {
    const [created] = await this.drizzle.db
      .insert(projects)
      .values({
        developerId: data.developerId,
        name: data.name,
        description: data.description,
        address: data.address,
        countryId: data.countryId,
        cityId: data.cityId,
        neighborhoodId: data.neighborhoodId,
        status: data.status,
        visibility: data.visibility,
        deliveryDate: data.deliveryDate,
        totalFloors: data.totalFloors,
        totalUnits: data.totalUnits,
        amenities: data.amenities,
        defaultCommissionPct: data.defaultCommissionPct,
        intentDeadlineHours: data.intentDeadlineHours,
      })
      .returning();

    return ProjectMapper.toDomain(created);
  }

  async findById(id: string): Promise<Project | null> {
    const [project] = await this.drizzle.db
      .select()
      .from(projects)
      .where(eq(projects.id, id));

    return project ? ProjectMapper.toDomain(project) : null;
  }

  async findByDeveloperId(
    developerId: string,
    limit: number,
    offset: number,
  ): Promise<PaginatedResult<Project>> {
    const [totalResult] = await this.drizzle.db
      .select({ count: count() })
      .from(projects)
      .where(eq(projects.developerId, developerId));

    const results = await this.drizzle.db
      .select()
      .from(projects)
      .where(eq(projects.developerId, developerId))
      .orderBy(desc(projects.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      data: results.map(ProjectMapper.toDomain),
      total: totalResult.count,
      limit,
      offset,
    };
  }

  async findAllPublished(
    limit: number,
    offset: number,
  ): Promise<PaginatedResult<Project>> {
    const [totalResult] = await this.drizzle.db
      .select({ count: count() })
      .from(projects)
      .where(eq(projects.status, 'PUBLISHED'));

    const results = await this.drizzle.db
      .select()
      .from(projects)
      .where(eq(projects.status, 'PUBLISHED'))
      .orderBy(desc(projects.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      data: results.map(ProjectMapper.toDomain),
      total: totalResult.count,
      limit,
      offset,
    };
  }

  async update(id: string, data: Partial<Project>): Promise<Project> {
    const updateData: Record<string, unknown> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.countryId !== undefined) updateData.countryId = data.countryId;
    if (data.cityId !== undefined) updateData.cityId = data.cityId;
    if (data.neighborhoodId !== undefined)
      updateData.neighborhoodId = data.neighborhoodId;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.visibility !== undefined) updateData.visibility = data.visibility;
    if (data.deliveryDate !== undefined)
      updateData.deliveryDate = data.deliveryDate;
    if (data.totalFloors !== undefined)
      updateData.totalFloors = data.totalFloors;
    if (data.totalUnits !== undefined) updateData.totalUnits = data.totalUnits;
    if (data.amenities !== undefined) updateData.amenities = data.amenities;
    if (data.defaultCommissionPct !== undefined)
      updateData.defaultCommissionPct = data.defaultCommissionPct;
    if (data.intentDeadlineHours !== undefined)
      updateData.intentDeadlineHours = data.intentDeadlineHours;
    if (data.publishedAt !== undefined)
      updateData.publishedAt = data.publishedAt;
    if (data.closedAt !== undefined) updateData.closedAt = data.closedAt;

    const [updated] = await this.drizzle.db
      .update(projects)
      .set(updateData)
      .where(eq(projects.id, id))
      .returning();

    return ProjectMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.drizzle.db.delete(projects).where(eq(projects.id, id));
  }
}
