import { Country } from '../entities/country.entity';

export const COUNTRY_REPOSITORY = 'COUNTRY_REPOSITORY';

export interface CreateCountryData {
  name: string;
  code: string;
}

export interface CountryRepository {
  create(data: CreateCountryData): Promise<Country>;
  findById(id: string): Promise<Country | null>;
  findByCode(code: string): Promise<Country | null>;
  findAll(onlyActive?: boolean): Promise<Country[]>;
  update(id: string, data: Partial<Country>): Promise<Country>;
  delete(id: string): Promise<void>;
}
