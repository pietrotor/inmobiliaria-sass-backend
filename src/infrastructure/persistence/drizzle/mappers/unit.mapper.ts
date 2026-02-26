import { Unit } from '@domain/unit/entities/unit.entity';
import { UnitStatus } from '@domain/unit/value-objects/unit-status.vo';
import { UnitType } from '@domain/unit/value-objects/unit-type.vo';
import { UnitAttributes } from '@domain/unit/value-objects/unit-attributes.vo';
import { UnitSchema } from '../schema/unit.schema';

export class UnitMapper {
  static toDomain(schema: UnitSchema): Unit {
    return new Unit({
      id: schema.id,
      projectId: schema.projectId,
      identifier: schema.identifier,
      type: schema.type as UnitType,
      status: schema.status as UnitStatus,
      priceUSD: schema.priceUSD,
      commissionPctOverride: schema.commissionPctOverride ?? null,
      attributes: schema.attributes as UnitAttributes,
      internalNotes: schema.internalNotes ?? null,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  static toPersistence(
    unit: Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>,
  ): Omit<UnitSchema, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      projectId: unit.projectId,
      identifier: unit.identifier,
      type: unit.type,
      status: unit.status,
      priceUSD: unit.priceUSD,
      commissionPctOverride: unit.commissionPctOverride,
      attributes: unit.attributes,
      internalNotes: unit.internalNotes,
    };
  }
}
