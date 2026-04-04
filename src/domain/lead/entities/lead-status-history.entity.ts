import { LeadStatus } from '../value-objects/lead-status.vo';

export interface LeadStatusHistoryProps {
  id: string;
  leadId: string;
  fromStatus: LeadStatus;
  toStatus: LeadStatus;
  changedByUserId: string;
  changedAt: Date;
}

export class LeadStatusHistory {
  public readonly id: string;
  public readonly leadId: string;
  public readonly fromStatus: LeadStatus;
  public readonly toStatus: LeadStatus;
  public readonly changedByUserId: string;
  public readonly changedAt: Date;

  constructor(props: LeadStatusHistoryProps) {
    this.id = props.id;
    this.leadId = props.leadId;
    this.fromStatus = props.fromStatus;
    this.toStatus = props.toStatus;
    this.changedByUserId = props.changedByUserId;
    this.changedAt = props.changedAt;
  }
}
