import { UnitStatus } from '../value-objects/unit-status.vo';
import { UnitType } from '../value-objects/unit-type.vo';
import { UnitAttributes } from '../value-objects/unit-attributes.vo';

export interface UnitProps {
  id: string;
  projectId: string;
  buildingId: string | null;
  typologyId: string;
  identifier: string;
  type: UnitType;
  status: UnitStatus;
  priceUSD: number;
  commissionPctOverride: number | null;
  attributes: UnitAttributes;
  internalNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Unit {
  public readonly id: string;
  public readonly projectId: string;
  public readonly buildingId: string | null;
  public readonly typologyId: string;
  public readonly identifier: string;
  public readonly type: UnitType;
  public readonly status: UnitStatus;
  public readonly priceUSD: number;
  public readonly commissionPctOverride: number | null;
  public readonly attributes: UnitAttributes;
  public readonly internalNotes: string | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: UnitProps) {
    this.id = props.id;
    this.projectId = props.projectId;
    this.buildingId = props.buildingId;
    this.typologyId = props.typologyId;
    this.identifier = props.identifier;
    this.type = props.type;
    this.status = props.status;
    this.priceUSD = props.priceUSD;
    this.commissionPctOverride = props.commissionPctOverride;
    this.attributes = props.attributes;
    this.internalNotes = props.internalNotes;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  private static readonly VALID_TRANSITIONS: Record<UnitStatus, UnitStatus[]> =
    {
      [UnitStatus.AVAILABLE]: [
        UnitStatus.WITH_INTEREST,
        UnitStatus.SUSPENDED,
        UnitStatus.SOLD,
        UnitStatus.UNAVAILABLE,
      ],
      [UnitStatus.WITH_INTEREST]: [
        UnitStatus.RESERVED,
        UnitStatus.AVAILABLE,
        UnitStatus.SUSPENDED,
      ],
      [UnitStatus.RESERVED]: [
        UnitStatus.SOLD,
        UnitStatus.AVAILABLE,
        UnitStatus.SUSPENDED,
      ],
      [UnitStatus.SUSPENDED]: [
        UnitStatus.AVAILABLE,
        UnitStatus.WITH_INTEREST,
        UnitStatus.RESERVED,
      ],
      [UnitStatus.SOLD]: [],
      [UnitStatus.UNAVAILABLE]: [],
    };

  canTransitionTo(target: UnitStatus): boolean {
    return Unit.VALID_TRANSITIONS[this.status].includes(target);
  }

  transitionTo(target: UnitStatus): Unit {
    if (!this.canTransitionTo(target)) {
      throw new Error(
        `Cannot transition unit from '${this.status}' to '${target}'.`,
      );
    }
    return new Unit({ ...this, status: target });
  }

  suspend(): Unit {
    return this.transitionTo(UnitStatus.SUSPENDED);
  }

  restore(): Unit {
    return this.transitionTo(UnitStatus.AVAILABLE);
  }

  markAsSold(): Unit {
    return this.transitionTo(UnitStatus.SOLD);
  }

  markAsUnavailable(): Unit {
    return this.transitionTo(UnitStatus.UNAVAILABLE);
  }

  isTerminal(): boolean {
    return (
      this.status === UnitStatus.SOLD ||
      this.status === UnitStatus.UNAVAILABLE
    );
  }

  isAvailable(): boolean {
    return this.status === UnitStatus.AVAILABLE;
  }

  updateInfo(
    data: Partial<
      Omit<
        UnitProps,
        'id' | 'projectId' | 'status' | 'createdAt' | 'updatedAt'
      >
    >,
  ): Unit {
    return new Unit({ ...this, ...data });
  }

  updatePrice(newPriceUSD: number): Unit {
    return new Unit({ ...this, priceUSD: newPriceUSD });
  }
}
