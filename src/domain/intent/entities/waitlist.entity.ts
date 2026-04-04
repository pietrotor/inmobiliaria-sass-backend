import { WaitlistStatus } from '../value-objects/waitlist-status.vo';

export interface WaitlistProps {
  id: string;
  unitId: string;
  brokerId: string;
  position: number;
  status: WaitlistStatus;
  notifiedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
}

export class Waitlist {
  public readonly id: string;
  public readonly unitId: string;
  public readonly brokerId: string;
  public readonly position: number;
  public readonly status: WaitlistStatus;
  public readonly notifiedAt?: Date;
  public readonly expiresAt?: Date;
  public readonly createdAt: Date;

  constructor(props: WaitlistProps) {
    this.id = props.id;
    this.unitId = props.unitId;
    this.brokerId = props.brokerId;
    this.position = props.position;
    this.status = props.status;
    this.notifiedAt = props.notifiedAt;
    this.expiresAt = props.expiresAt;
    this.createdAt = props.createdAt;
  }

  notify(): Waitlist {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    return new Waitlist({
      ...this,
      status: WaitlistStatus.NOTIFIED,
      notifiedAt: now,
      expiresAt,
    });
  }

  expire(): Waitlist {
    return new Waitlist({ ...this, status: WaitlistStatus.EXPIRED });
  }

  discard(): Waitlist {
    return new Waitlist({ ...this, status: WaitlistStatus.DISCARDED });
  }
}
