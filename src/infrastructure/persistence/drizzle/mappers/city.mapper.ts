import { City } from '@domain/location/entities/city.entity';
import { CitySchema } from '../schema/city.schema';

export class CityMapper {
  static toDomain(schema: CitySchema): City {
    return new City({
      id: schema.id,
      name: schema.name,
      countryId: schema.countryId,
      isActive: schema.isActive,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  static toPersistence(
    domain: City,
  ): Omit<CitySchema, 'createdAt' | 'updatedAt'> {
    return {
      id: domain.id,
      name: domain.name,
      countryId: domain.countryId,
      isActive: domain.isActive,
    };
  }
}
