import { UnitTypology } from '../entities/unit-typology.entity';
import { UnitType } from '@domain/unit/value-objects/unit-type.vo';
import { UnitAttributes } from '@domain/unit/value-objects/unit-attributes.vo';

export const UNIT_TYPOLOGY_REPOSITORY = 'UNIT_TYPOLOGY_REPOSITORY';

export interface CreateUnitTypologyData {
  projectId: string;
  name: string;
  unitType: UnitType;
  basePriceUsd: number | null;
  baseAttributes: UnitAttributes | Record<string, unknown>;
  description: string | null;
  sortOrder: number;
}

export interface UnitTypologyWithCount extends Omit<UnitTypology, 'updateInfo'> {
  unitCount: number;
}

export interface UnitTypologyRepository {
  create(data: CreateUnitTypologyData): Promise<UnitTypology>;
  findById(id: string): Promise<UnitTypology | null>;
  findByProjectId(projectId: string): Promise<UnitTypology[]>;
  findByProjectIdWithUnitCount(
    projectId: string,
  ): Promise<UnitTypologyWithCount[]>;
  update(id: string, data: Partial<UnitTypology>): Promise<UnitTypology>;
  delete(id: string): Promise<void>;
}
