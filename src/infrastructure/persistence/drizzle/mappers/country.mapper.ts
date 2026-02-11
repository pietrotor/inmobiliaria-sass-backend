import { Country } from '@domain/location/entities/country.entity';
import { CountrySchema } from '../schema/country.schema';

export class CountryMapper {
  static toDomain(schema: CountrySchema): Country {
    return new Country({
      id: schema.id,
      name: schema.name,
      code: schema.code,
      isActive: schema.isActive,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  static toPersistence(
    domain: Country,
  ): Omit<CountrySchema, 'createdAt' | 'updatedAt'> {
    return {
      id: domain.id,
      name: domain.name,
      code: domain.code,
      isActive: domain.isActive,
    };
  }
}
