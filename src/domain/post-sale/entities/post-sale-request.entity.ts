import { PostSaleRequestType } from '../value-objects/request-type.vo';
import { PostSaleRequestStatus } from '../value-objects/request-status.vo';

export interface PostSaleRequestProps {
  id: string;
  unitId: string;
  reservationId: string;
  requestType: PostSaleRequestType;
  description: string;
  assignedToUserId?: string;
  status: PostSaleRequestStatus;
  resolutionDeadline?: Date;
  processNotes?: string;
  registrationDate: Date;
  closingDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VALID_TRANSITIONS: Record<PostSaleRequestStatus, PostSaleRequestStatus[]> = {
  [PostSaleRequestStatus.OPEN]: [PostSaleRequestStatus.IN_PROGRESS],
  [PostSaleRequestStatus.IN_PROGRESS]: [PostSaleRequestStatus.RESOLVED],
  [PostSaleRequestStatus.RESOLVED]: [PostSaleRequestStatus.CLOSED],
  [PostSaleRequestStatus.CLOSED]: [],
};

export class PostSaleRequest {
  public readonly id: string;
  public readonly unitId: string;
  public readonly reservationId: string;
  public readonly requestType: PostSaleRequestType;
  public readonly description: string;
  public readonly assignedToUserId?: string;
  public readonly status: PostSaleRequestStatus;
  public readonly resolutionDeadline?: Date;
  public readonly processNotes?: string;
  public readonly registrationDate: Date;
  public readonly closingDate?: Date;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: PostSaleRequestProps) {
    this.id = props.id;
    this.unitId = props.unitId;
    this.reservationId = props.reservationId;
    this.requestType = props.requestType;
    this.description = props.description;
    this.assignedToUserId = props.assignedToUserId;
    this.status = props.status;
    this.resolutionDeadline = props.resolutionDeadline;
    this.processNotes = props.processNotes;
    this.registrationDate = props.registrationDate;
    this.closingDate = props.closingDate;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  canTransitionTo(target: PostSaleRequestStatus): boolean {
    return VALID_TRANSITIONS[this.status]?.includes(target) ?? false;
  }

  transitionTo(target: PostSaleRequestStatus): PostSaleRequest {
    if (!this.canTransitionTo(target)) {
      throw new Error(`Cannot transition post-sale request from ${this.status} to ${target}`);
    }
    const updates: Partial<PostSaleRequestProps> = { status: target };
    if (target === PostSaleRequestStatus.CLOSED) {
      updates.closingDate = new Date();
    }
    return new PostSaleRequest({ ...this, ...updates });
  }

  assignTo(userId: string): PostSaleRequest {
    return new PostSaleRequest({ ...this, assignedToUserId: userId });
  }

  addNotes(notes: string): PostSaleRequest {
    const existing = this.processNotes ? this.processNotes + '\n' : '';
    return new PostSaleRequest({ ...this, processNotes: existing + notes });
  }

  isStale(staleDays: number = 7): boolean {
    if (this.status === PostSaleRequestStatus.CLOSED) return false;
    const daysSinceUpdate = (Date.now() - this.updatedAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceUpdate > staleDays;
  }
}
