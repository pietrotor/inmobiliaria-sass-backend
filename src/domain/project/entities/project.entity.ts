import { ProjectStatus } from '../value-objects/project-status.vo';
import { ProjectVisibility } from '../value-objects/project-visibility.vo';
import { ProjectType } from '../value-objects/project-type.vo';
import { ProjectAmenity } from '../value-objects/project-amenity.vo';
import { ConstructionPhase } from '../value-objects/construction-phase.vo';

export interface ProjectProps {
  id: string;
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
  amenities: ProjectAmenity[];
  customAmenities: string[];
  defaultCommissionPct: number;
  intentDeadlineHours: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  closedAt: Date | null;
}

export class Project {
  public readonly id: string;
  public readonly developerId: string;
  public readonly name: string;
  public readonly description: string | null;
  public readonly address: string;
  public readonly countryId: string;
  public readonly cityId: string;
  public readonly neighborhoodId: string;
  public readonly latitude: number | null;
  public readonly longitude: number | null;
  public readonly projectType: ProjectType;
  public readonly status: ProjectStatus;
  public readonly visibility: ProjectVisibility;
  public readonly constructionPhase: ConstructionPhase;
  public readonly deliveryDate: Date | null;
  public readonly totalFloors: number | null;
  public readonly totalUnits: number;
  public readonly amenities: ProjectAmenity[];
  public readonly customAmenities: string[];
  public readonly defaultCommissionPct: number;
  public readonly intentDeadlineHours: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly publishedAt: Date | null;
  public readonly closedAt: Date | null;

  constructor(props: ProjectProps) {
    this.id = props.id;
    this.developerId = props.developerId;
    this.name = props.name;
    this.description = props.description;
    this.address = props.address;
    this.countryId = props.countryId;
    this.cityId = props.cityId;
    this.neighborhoodId = props.neighborhoodId;
    this.latitude = props.latitude;
    this.longitude = props.longitude;
    this.projectType = props.projectType;
    this.status = props.status;
    this.visibility = props.visibility;
    this.constructionPhase = props.constructionPhase;
    this.deliveryDate = props.deliveryDate;
    this.totalFloors = props.totalFloors;
    this.totalUnits = props.totalUnits;
    this.amenities = props.amenities;
    this.customAmenities = props.customAmenities;
    this.defaultCommissionPct = props.defaultCommissionPct;
    this.intentDeadlineHours = props.intentDeadlineHours;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.publishedAt = props.publishedAt;
    this.closedAt = props.closedAt;
  }

  private static readonly VALID_TRANSITIONS: Record<
    ProjectStatus,
    ProjectStatus[]
  > = {
    [ProjectStatus.DRAFT]: [ProjectStatus.PUBLISHED],
    [ProjectStatus.PUBLISHED]: [ProjectStatus.PAUSED, ProjectStatus.CLOSED],
    [ProjectStatus.PAUSED]: [ProjectStatus.PUBLISHED, ProjectStatus.CLOSED],
    [ProjectStatus.CLOSED]: [],
  };

  canTransitionTo(target: ProjectStatus): boolean {
    return Project.VALID_TRANSITIONS[this.status].includes(target);
  }

  publish(): Project {
    if (!this.canTransitionTo(ProjectStatus.PUBLISHED)) {
      throw new Error(
        `Cannot publish project in status '${this.status}'. Only DRAFT or PAUSED projects can be published.`,
      );
    }

    return new Project({
      ...this,
      status: ProjectStatus.PUBLISHED,
      publishedAt: this.publishedAt ?? new Date(),
    });
  }

  pause(): Project {
    if (!this.canTransitionTo(ProjectStatus.PAUSED)) {
      throw new Error(
        `Cannot pause project in status '${this.status}'. Only PUBLISHED projects can be paused.`,
      );
    }

    return new Project({
      ...this,
      status: ProjectStatus.PAUSED,
    });
  }

  close(): Project {
    if (!this.canTransitionTo(ProjectStatus.CLOSED)) {
      throw new Error(
        `Cannot close project in status '${this.status}'. Only PUBLISHED or PAUSED projects can be closed.`,
      );
    }

    return new Project({
      ...this,
      status: ProjectStatus.CLOSED,
      closedAt: new Date(),
    });
  }

  isClosed(): boolean {
    return this.status === ProjectStatus.CLOSED;
  }

  isPublished(): boolean {
    return this.status === ProjectStatus.PUBLISHED;
  }

  isPublic(): boolean {
    return this.visibility === ProjectVisibility.PUBLIC;
  }

  isVertical(): boolean {
    return this.projectType === ProjectType.VERTICAL;
  }

  isHorizontal(): boolean {
    return this.projectType === ProjectType.HORIZONTAL;
  }

  updateInfo(
    data: Partial<
      Omit<
        ProjectProps,
        | 'id'
        | 'developerId'
        | 'status'
        | 'createdAt'
        | 'updatedAt'
        | 'publishedAt'
        | 'closedAt'
      >
    >,
  ): Project {
    return new Project({
      ...this,
      ...data,
    });
  }
}
