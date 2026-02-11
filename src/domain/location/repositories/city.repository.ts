import { City } from '../entities/city.entity';

export const CITY_REPOSITORY = 'CITY_REPOSITORY';

export interface CreateCityData {
  name: string;
  countryId: string;
}

export interface CityRepository {
  create(data: CreateCityData): Promise<City>;
  findById(id: string): Promise<City | null>;
  findByCountryId(countryId: string, onlyActive?: boolean): Promise<City[]>;
  findAll(onlyActive?: boolean): Promise<City[]>;
  update(id: string, data: Partial<City>): Promise<City>;
  delete(id: string): Promise<void>;
}
