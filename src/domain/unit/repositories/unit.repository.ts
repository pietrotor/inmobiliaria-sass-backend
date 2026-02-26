import { Unit } from '../entities/unit.entity';
import { UnitStatus } from '../value-objects/unit-status.vo';
import { UnitType } from '../value-objects/unit-type.vo';
import { UnitAttributes } from '../value-objects/unit-attributes.vo';
import { PaginatedResult } from '@domain/common/interfaces/paginated-result.interface';

export const UNIT_REPOSITORY = 'UNIT_REPOSITORY';

export interface CreateUnitData {
  projectId: string;
  identifier: string;
  type: UnitType;
  status: UnitStatus;
  priceUSD: number;
  commissionPctOverride: number | null;
  attributes: UnitAttributes;
  internalNotes: string | null;
}

export interface UnitFilters {
  status?: UnitStatus;
  type?: UnitType;
  minPrice?: number;
  maxPrice?: number;
  floor?: number;
}

export interface UnitRepository {
  create(data: CreateUnitData): Promise<Unit>;
  findById(id: string): Promise<Unit | null>;
  findByProjectId(
    projectId: string,
    limit: number,
    offset: number,
    filters?: UnitFilters,
  ): Promise<PaginatedResult<Unit>>;
  update(id: string, data: Partial<Unit>): Promise<Unit>;
  delete(id: string): Promise<void>;
  countByProjectId(projectId: string): Promise<number>;
}
