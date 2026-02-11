import { Neighborhood } from '@domain/location/entities/neighborhood.entity';
import { NeighborhoodSchema } from '../schema/neighborhood.schema';

export class NeighborhoodMapper {
  static toDomain(schema: NeighborhoodSchema): Neighborhood {
    return new Neighborhood({
      id: schema.id,
      name: schema.name,
      cityId: schema.cityId,
      isActive: schema.isActive,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  static toPersistence(
    domain: Neighborhood,
  ): Omit<NeighborhoodSchema, 'createdAt' | 'updatedAt'> {
    return {
      id: domain.id,
      name: domain.name,
      cityId: domain.cityId,
      isActive: domain.isActive,
    };
  }
}
