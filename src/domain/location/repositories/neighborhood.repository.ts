import { Neighborhood } from '../entities/neighborhood.entity';

export const NEIGHBORHOOD_REPOSITORY = 'NEIGHBORHOOD_REPOSITORY';

export interface CreateNeighborhoodData {
  name: string;
  cityId: string;
}

export interface NeighborhoodRepository {
  create(data: CreateNeighborhoodData): Promise<Neighborhood>;
  findById(id: string): Promise<Neighborhood | null>;
  findByCityId(cityId: string, onlyActive?: boolean): Promise<Neighborhood[]>;
  findAll(onlyActive?: boolean): Promise<Neighborhood[]>;
  update(id: string, data: Partial<Neighborhood>): Promise<Neighborhood>;
  delete(id: string): Promise<void>;
}
