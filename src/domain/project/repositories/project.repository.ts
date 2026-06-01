import { Project } from '../entities/project.entity';
import { ProjectStatus } from '../value-objects/project-status.vo';
import { ProjectVisibility } from '../value-objects/project-visibility.vo';
import { ProjectType } from '../value-objects/project-type.vo';
import { ConstructionPhase } from '../value-objects/construction-phase.vo';
import { PaginatedResult } from '@domain/common/interfaces/paginated-result.interface';

export const PROJECT_REPOSITORY = 'PROJECT_REPOSITORY';

export type ProjectFilters = { search?: string; status?: ProjectStatus };

export interface CreateProjectData {
  developerId: string;
  name: string;
  description: string | null;
  address: string;
  countryId: string;
  cityId: string;
  neighborhoodId: string;
  latitude: number | null;
  longitude: number | null;
  projectType: ProjectType;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  constructionPhase: ConstructionPhase;
  deliveryDate: Date | null;
  totalFloors: number | null;
  totalUnits: number;
  amenities: string[];
  customAmenities: string[];
  defaultCommissionPct: number;
  intentDeadlineHours: number;
}

export interface ProjectRepository {
  create(data: CreateProjectData): Promise<Project>;
  findById(id: string): Promise<Project | null>;
  findByDeveloperId(
    developerId: string,
    limit: number,
    offset: number,
    filters?: ProjectFilters,
  ): Promise<PaginatedResult<Project>>;
  findAllPublished(
    limit: number,
    offset: number,
  ): Promise<PaginatedResult<Project>>;
  update(id: string, data: Partial<Project>): Promise<Project>;
  delete(id: string): Promise<void>;
}
