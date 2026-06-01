import { UnitTypology } from '@domain/unit-typology/entities/unit-typology.entity';
import { UnitType } from '@domain/unit/value-objects/unit-type.vo';
import { UnitAttributes } from '@domain/unit/value-objects/unit-attributes.vo';
import { UnitTypologySchema } from '../schema/unit-typology.schema';

export class UnitTypologyMapper {
  static toDomain(schema: UnitTypologySchema): UnitTypology {
    return new UnitTypology({
      id: schema.id,
      projectId: schema.projectId,
      name: schema.name,
      unitType: schema.unitType as UnitType,
      basePriceUsd: schema.basePriceUsd ?? null,
      baseAttributes:
        (schema.baseAttributes as UnitAttributes | Record<string, unknown>) ??
        {},
      description: schema.description ?? null,
      sortOrder: schema.sortOrder,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }
}
