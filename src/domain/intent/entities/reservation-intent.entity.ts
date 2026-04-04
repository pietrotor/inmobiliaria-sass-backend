import { IntentStatus } from '../value-objects/intent-status.vo';
import { RejectionReason } from '../value-objects/rejection-reason.vo';

export interface ReservationIntentProps {
  id: string;
  brokerId: string;
  projectId: string;
  unitIds: string[];
  clientName: string;
  clientNationalId: string;
  clientPhone: string;
  clientEmail?: string;
  hasFinancing: boolean;
  hasVisited: boolean;
  status: IntentStatus;
  deadlineAt: Date;
  pausedTimeRemainingMs?: number;
  rejectionReason?: RejectionReason;
  rejectionNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ReservationIntent {
  public readonly id: string;
  public readonly brokerId: string;
  public readonly projectId: string;
  public readonly unitIds: string[];
  public readonly clientName: string;
  public readonly clientNationalId: string;
  public readonly clientPhone: string;
  public readonly clientEmail?: string;
  public readonly hasFinancing: boolean;
  public readonly hasVisited: boolean;
  public readonly status: IntentStatus;
  public readonly deadlineAt: Date;
  public readonly pausedTimeRemainingMs?: number;
  public readonly rejectionReason?: RejectionReason;
  public readonly rejectionNote?: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: ReservationIntentProps) {
    this.id = props.id;
    this.brokerId = props.brokerId;
    this.projectId = props.projectId;
    this.unitIds = props.unitIds;
    this.clientName = props.clientName;
    this.clientNationalId = props.clientNationalId;
    this.clientPhone = props.clientPhone;
    this.clientEmail = props.clientEmail;
    this.hasFinancing = props.hasFinancing;
    this.hasVisited = props.hasVisited;
    this.status = props.status;
    this.deadlineAt = props.deadlineAt;
    this.pausedTimeRemainingMs = props.pausedTimeRemainingMs;
    this.rejectionReason = props.rejectionReason;
    this.rejectionNote = props.rejectionNote;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  isActive(): boolean {
    return this.status === IntentStatus.ACTIVE;
  }

  isExpired(): boolean {
    return this.status === IntentStatus.EXPIRED || (this.isActive() && new Date() > this.deadlineAt);
  }

  approve(): ReservationIntent {
    return new ReservationIntent({ ...this, status: IntentStatus.APPROVED });
  }

  reject(reason: RejectionReason, note?: string): ReservationIntent {
    return new ReservationIntent({
      ...this,
      status: IntentStatus.REJECTED,
      rejectionReason: reason,
      rejectionNote: note,
    });
  }

  cancel(): ReservationIntent {
    return new ReservationIntent({ ...this, status: IntentStatus.CANCELLED });
  }

  expire(): ReservationIntent {
    return new ReservationIntent({ ...this, status: IntentStatus.EXPIRED });
  }

  pause(remainingMs: number): ReservationIntent {
    return new ReservationIntent({ ...this, pausedTimeRemainingMs: remainingMs });
  }

  resume(newDeadline: Date): ReservationIntent {
    return new ReservationIntent({
      ...this,
      deadlineAt: newDeadline,
      pausedTimeRemainingMs: undefined,
    });
  }
}
