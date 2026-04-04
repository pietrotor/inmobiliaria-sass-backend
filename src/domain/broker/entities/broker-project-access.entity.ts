import { BrokerAccessStatus } from '../value-objects/broker-access-status.vo';

export interface BrokerProjectAccessProps {
  id: string;
  brokerId: string;
  projectId: string;
  status: BrokerAccessStatus;
  createdAt: Date;
}

export class BrokerProjectAccess {
  public readonly id: string;
  public readonly brokerId: string;
  public readonly projectId: string;
  public readonly status: BrokerAccessStatus;
  public readonly createdAt: Date;

  constructor(props: BrokerProjectAccessProps) {
    this.id = props.id;
    this.brokerId = props.brokerId;
    this.projectId = props.projectId;
    this.status = props.status;
    this.createdAt = props.createdAt;
  }

  accept(): BrokerProjectAccess {
    return new BrokerProjectAccess({ ...this, status: BrokerAccessStatus.ACCEPTED });
  }
}
