import { ReservationStatus } from '../value-objects/reservation-status.vo';
import { SalesChannel } from '../value-objects/sales-channel.vo';

export interface ReservationProps {
  id: string;
  unitIds: string[];
  clientName: string;
  clientNationalId: string;
  clientPhone: string;
  clientEmail?: string;
  salesChannel: SalesChannel;
  brokerId?: string;
  intentId?: string;
  executiveId?: string;
  developerId: string;
  reservationPaymentAmount: number;
  reservationPaymentCurrency: string;
  reservationPaymentDate: Date;
  agreementDeadline?: Date;
  status: ReservationStatus;
  agreementSignedDate?: Date;
  deliveryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VALID_TRANSITIONS: Record<ReservationStatus, ReservationStatus[]> = {
  [ReservationStatus.RESERVED]: [ReservationStatus.AGREEMENT_SIGNED, ReservationStatus.FALLEN],
  [ReservationStatus.AGREEMENT_SIGNED]: [ReservationStatus.IN_PROCESS, ReservationStatus.FALLEN],
  [ReservationStatus.IN_PROCESS]: [ReservationStatus.DELIVERED, ReservationStatus.FALLEN],
  [ReservationStatus.DELIVERED]: [],
  [ReservationStatus.FALLEN]: [],
};

export class Reservation {
  public readonly id: string;
  public readonly unitIds: string[];
  public readonly clientName: string;
  public readonly clientNationalId: string;
  public readonly clientPhone: string;
  public readonly clientEmail?: string;
  public readonly salesChannel: SalesChannel;
  public readonly brokerId?: string;
  public readonly intentId?: string;
  public readonly executiveId?: string;
  public readonly developerId: string;
  public readonly reservationPaymentAmount: number;
  public readonly reservationPaymentCurrency: string;
  public readonly reservationPaymentDate: Date;
  public readonly agreementDeadline?: Date;
  public readonly status: ReservationStatus;
  public readonly agreementSignedDate?: Date;
  public readonly deliveryDate?: Date;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: ReservationProps) {
    this.id = props.id;
    this.unitIds = props.unitIds;
    this.clientName = props.clientName;
    this.clientNationalId = props.clientNationalId;
    this.clientPhone = props.clientPhone;
    this.clientEmail = props.clientEmail;
    this.salesChannel = props.salesChannel;
    this.brokerId = props.brokerId;
    this.intentId = props.intentId;
    this.executiveId = props.executiveId;
    this.developerId = props.developerId;
    this.reservationPaymentAmount = props.reservationPaymentAmount;
    this.reservationPaymentCurrency = props.reservationPaymentCurrency;
    this.reservationPaymentDate = props.reservationPaymentDate;
    this.agreementDeadline = props.agreementDeadline;
    this.status = props.status;
    this.agreementSignedDate = props.agreementSignedDate;
    this.deliveryDate = props.deliveryDate;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  canTransitionTo(target: ReservationStatus): boolean {
    return VALID_TRANSITIONS[this.status]?.includes(target) ?? false;
  }

  transitionTo(target: ReservationStatus): Reservation {
    if (!this.canTransitionTo(target)) {
      throw new Error(`Cannot transition reservation from ${this.status} to ${target}`);
    }
    return new Reservation({ ...this, status: target });
  }

  signAgreement(date: Date): Reservation {
    return new Reservation({
      ...this,
      status: ReservationStatus.AGREEMENT_SIGNED,
      agreementSignedDate: date,
    });
  }

  deliver(date: Date): Reservation {
    return new Reservation({
      ...this,
      status: ReservationStatus.DELIVERED,
      deliveryDate: date,
    });
  }

  fall(): Reservation {
    return new Reservation({ ...this, status: ReservationStatus.FALLEN });
  }

  isTerminal(): boolean {
    return this.status === ReservationStatus.DELIVERED || this.status === ReservationStatus.FALLEN;
  }

  isBrokerSale(): boolean {
    return this.salesChannel === SalesChannel.BROKER;
  }
}
