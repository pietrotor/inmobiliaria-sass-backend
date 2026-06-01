import { UnitType } from '@domain/unit/value-objects/unit-type.vo';
import { UnitAttributes } from '@domain/unit/value-objects/unit-attributes.vo';

export interface UnitTypologyProps {
  id: string;
  projectId: string;
  name: string;
  unitType: UnitType;
  basePriceUsd: number | null;
  baseAttributes: UnitAttributes | Record<string, unknown>;
  description: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export class UnitTypology {
  public readonly id: string;
  public readonly projectId: string;
  public readonly name: string;
  public readonly unitType: UnitType;
  public readonly basePriceUsd: number | null;
  public readonly baseAttributes: UnitAttributes | Record<string, unknown>;
  public readonly description: string | null;
  public readonly sortOrder: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: UnitTypologyProps) {
    this.id = props.id;
    this.projectId = props.projectId;
    this.name = props.name;
    this.unitType = props.unitType;
    this.basePriceUsd = props.basePriceUsd;
    this.baseAttributes = props.baseAttributes;
    this.description = props.description;
    this.sortOrder = props.sortOrder;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  updateInfo(
    data: Partial<
      Omit<UnitTypologyProps, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>
    >,
  ): UnitTypology {
    return new UnitTypology({ ...this, ...data });
  }
}
