import { Project } from '@domain/project/entities/project.entity';
import { ProjectStatus } from '@domain/project/value-objects/project-status.vo';
import { ProjectVisibility } from '@domain/project/value-objects/project-visibility.vo';
import { ProjectType } from '@domain/project/value-objects/project-type.vo';
import { ProjectAmenity } from '@domain/project/value-objects/project-amenity.vo';
import { ConstructionPhase } from '@domain/project/value-objects/construction-phase.vo';
import { ProjectSchema } from '../schema/project.schema';

export class ProjectMapper {
  static toDomain(schema: ProjectSchema): Project {
    return new Project({
      id: schema.id,
      developerId: schema.developerId,
      name: schema.name,
      description: schema.description || null,
      address: schema.address,
      countryId: schema.countryId,
      cityId: schema.cityId,
      neighborhoodId: schema.neighborhoodId,
      latitude: schema.latitude ?? null,
      longitude: schema.longitude ?? null,
      projectType: (schema.projectType as ProjectType) ?? ProjectType.VERTICAL,
      status: schema.status as ProjectStatus,
      visibility: schema.visibility as ProjectVisibility,
      constructionPhase:
        (schema.constructionPhase as ConstructionPhase) ??
        ConstructionPhase.PRE_LAUNCH,
      deliveryDate: schema.deliveryDate || null,
      totalFloors: schema.totalFloors || null,
      totalUnits: schema.totalUnits,
      amenities: (schema.amenities as string[]).map(
        (a) => a as ProjectAmenity,
      ),
      customAmenities: (schema.customAmenities as string[]) ?? [],
      defaultCommissionPct: schema.defaultCommissionPct,
      intentDeadlineHours: schema.intentDeadlineHours,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
      publishedAt: schema.publishedAt || null,
      closedAt: schema.closedAt || null,
    });
  }

  static toPersistence(
    project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>,
  ): Omit<ProjectSchema, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      developerId: project.developerId,
      name: project.name,
      description: project.description,
      address: project.address,
      countryId: project.countryId,
      cityId: project.cityId,
      neighborhoodId: project.neighborhoodId,
      latitude: project.latitude,
      longitude: project.longitude,
      projectType: project.projectType,
      status: project.status,
      visibility: project.visibility,
      constructionPhase: project.constructionPhase,
      deliveryDate: project.deliveryDate,
      totalFloors: project.totalFloors,
      totalUnits: project.totalUnits,
      amenities: project.amenities,
      customAmenities: project.customAmenities,
      defaultCommissionPct: project.defaultCommissionPct,
      intentDeadlineHours: project.intentDeadlineHours,
      publishedAt: project.publishedAt,
      closedAt: project.closedAt,
    };
  }
}
