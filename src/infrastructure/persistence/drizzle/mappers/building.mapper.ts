import { Building } from '@domain/building/entities/building.entity';
import { BuildingSchema } from '../schema/building.schema';

export class BuildingMapper {
  static toDomain(schema: BuildingSchema): Building {
    return new Building({
      id: schema.id,
      projectId: schema.projectId,
      name: schema.name,
      totalFloors: schema.totalFloors,
      sortOrder: schema.sortOrder,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }
}
