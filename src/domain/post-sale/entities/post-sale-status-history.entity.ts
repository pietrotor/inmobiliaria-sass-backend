import { PostSaleRequestStatus } from '../value-objects/request-status.vo';

export interface PostSaleStatusHistoryProps {
  id: string;
  requestId: string;
  fromStatus: PostSaleRequestStatus;
  toStatus: PostSaleRequestStatus;
  changedByUserId: string;
  changedAt: Date;
}

export class PostSaleStatusHistory {
  public readonly id: string;
  public readonly requestId: string;
  public readonly fromStatus: PostSaleRequestStatus;
  public readonly toStatus: PostSaleRequestStatus;
  public readonly changedByUserId: string;
  public readonly changedAt: Date;

  constructor(props: PostSaleStatusHistoryProps) {
    this.id = props.id;
    this.requestId = props.requestId;
    this.fromStatus = props.fromStatus;
    this.toStatus = props.toStatus;
    this.changedByUserId = props.changedByUserId;
    this.changedAt = props.changedAt;
  }
}
