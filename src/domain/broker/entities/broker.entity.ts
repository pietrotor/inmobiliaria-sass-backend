import { BrokerPlan } from '../value-objects/broker-plan.vo';
import { BrokerStatus } from '../value-objects/broker-status.vo';

export interface BrokerProps {
  id: string;
  userId: string;
  plan: BrokerPlan;
  status: BrokerStatus;
  companyName?: string;
  licenseNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Broker {
  public readonly id: string;
  public readonly userId: string;
  public readonly plan: BrokerPlan;
  public readonly status: BrokerStatus;
  public readonly companyName?: string;
  public readonly licenseNumber?: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: BrokerProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.plan = props.plan;
    this.status = props.status;
    this.companyName = props.companyName;
    this.licenseNumber = props.licenseNumber;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  isPro(): boolean {
    return this.plan === BrokerPlan.PRO;
  }

  isApproved(): boolean {
    return this.status === BrokerStatus.APPROVED;
  }

  isPending(): boolean {
    return this.status === BrokerStatus.PENDING;
  }

  isSuspended(): boolean {
    return this.status === BrokerStatus.SUSPENDED;
  }

  canDeclareIntent(): boolean {
    return this.isApproved() && this.isPro();
  }

  approve(): Broker {
    return new Broker({ ...this, status: BrokerStatus.APPROVED });
  }

  suspend(): Broker {
    return new Broker({ ...this, status: BrokerStatus.SUSPENDED });
  }

  upgradeToPro(): Broker {
    return new Broker({ ...this, plan: BrokerPlan.PRO });
  }

  updateInfo(data: Partial<Pick<BrokerProps, 'companyName' | 'licenseNumber'>>): Broker {
    return new Broker({ ...this, ...data });
  }
}
