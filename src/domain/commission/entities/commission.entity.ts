import { CommissionStatus } from '../value-objects/commission-status.vo';

export interface CommissionUnitDetail {
  unitId: string;
  salePriceUSD: number;
  commissionPct: number;
  commissionAmountUSD: number;
}

export interface CommissionProps {
  id: string;
  brokerId: string;
  intentId: string;
  reservationId: string;
  developerId: string;
  units: CommissionUnitDetail[];
  totalAmountUSD: number;
  status: CommissionStatus;
  paidAt?: Date;
  paidByUserId?: string;
  disputeNote?: string;
  createdAt: Date;
}

export class Commission {
  public readonly id: string;
  public readonly brokerId: string;
  public readonly intentId: string;
  public readonly reservationId: string;
  public readonly developerId: string;
  public readonly units: CommissionUnitDetail[];
  public readonly totalAmountUSD: number;
  public readonly status: CommissionStatus;
  public readonly paidAt?: Date;
  public readonly paidByUserId?: string;
  public readonly disputeNote?: string;
  public readonly createdAt: Date;

  constructor(props: CommissionProps) {
    this.id = props.id;
    this.brokerId = props.brokerId;
    this.intentId = props.intentId;
    this.reservationId = props.reservationId;
    this.developerId = props.developerId;
    this.units = props.units;
    this.totalAmountUSD = props.totalAmountUSD;
    this.status = props.status;
    this.paidAt = props.paidAt;
    this.paidByUserId = props.paidByUserId;
    this.disputeNote = props.disputeNote;
    this.createdAt = props.createdAt;
  }

  markAsPaid(paidByUserId: string): Commission {
    return new Commission({
      ...this,
      status: CommissionStatus.PAID,
      paidAt: new Date(),
      paidByUserId,
    });
  }

  dispute(note: string): Commission {
    return new Commission({
      ...this,
      status: CommissionStatus.IN_DISPUTE,
      disputeNote: note,
    });
  }

  isPending(): boolean {
    return this.status === CommissionStatus.PENDING;
  }
}
