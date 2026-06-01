import { Building } from '../entities/building.entity';

export const BUILDING_REPOSITORY = 'BUILDING_REPOSITORY';

export interface CreateBuildingData {
  projectId: string;
  name: string;
  totalFloors: number;
  sortOrder: number;
}

export interface BuildingRepository {
  create(data: CreateBuildingData): Promise<Building>;
  createMany(data: CreateBuildingData[]): Promise<Building[]>;
  findById(id: string): Promise<Building | null>;
  findByProjectId(projectId: string): Promise<Building[]>;
  update(id: string, data: Partial<Building>): Promise<Building>;
  delete(id: string): Promise<void>;
  countByProjectId(projectId: string): Promise<number>;
}
