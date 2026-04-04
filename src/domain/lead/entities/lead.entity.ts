import { LeadStatus } from '../value-objects/lead-status.vo';
import { LeadSource } from '../value-objects/lead-source.vo';

export interface LeadProps {
  id: string;
  developerId: string;
  assignedExecutiveId: string | null;
  fullName: string;
  nationalId: string;
  phone: string;
  email?: string;
  source: LeadSource;
  status: LeadStatus;
  interestedUnitIds: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VALID_TRANSITIONS: Record<LeadStatus, LeadStatus[]> = {
  [LeadStatus.NEW]: [LeadStatus.CONTACTED, LeadStatus.LOST],
  [LeadStatus.CONTACTED]: [LeadStatus.VISITED, LeadStatus.LOST],
  [LeadStatus.VISITED]: [LeadStatus.QUOTED, LeadStatus.LOST],
  [LeadStatus.QUOTED]: [LeadStatus.RESERVED, LeadStatus.LOST],
  [LeadStatus.RESERVED]: [],
  [LeadStatus.LOST]: [],
};

export class Lead {
  public readonly id: string;
  public readonly developerId: string;
  public readonly assignedExecutiveId: string | null;
  public readonly fullName: string;
  public readonly nationalId: string;
  public readonly phone: string;
  public readonly email?: string;
  public readonly source: LeadSource;
  public readonly status: LeadStatus;
  public readonly interestedUnitIds: string[];
  public readonly notes?: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: LeadProps) {
    this.id = props.id;
    this.developerId = props.developerId;
    this.assignedExecutiveId = props.assignedExecutiveId;
    this.fullName = props.fullName;
    this.nationalId = props.nationalId;
    this.phone = props.phone;
    this.email = props.email;
    this.source = props.source;
    this.status = props.status;
    this.interestedUnitIds = props.interestedUnitIds;
    this.notes = props.notes;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  canTransitionTo(target: LeadStatus): boolean {
    return VALID_TRANSITIONS[this.status]?.includes(target) ?? false;
  }

  transitionTo(target: LeadStatus): Lead {
    if (!this.canTransitionTo(target)) {
      throw new Error(
        `Cannot transition lead from ${this.status} to ${target}`,
      );
    }
    return new Lead({ ...this, status: target });
  }

  assignTo(executiveId: string): Lead {
    return new Lead({ ...this, assignedExecutiveId: executiveId });
  }

  isTerminal(): boolean {
    return (
      this.status === LeadStatus.RESERVED || this.status === LeadStatus.LOST
    );
  }

  updateInfo(
    data: Partial<
      Pick<
        LeadProps,
        'fullName' | 'phone' | 'email' | 'notes' | 'interestedUnitIds'
      >
    >,
  ): Lead {
    return new Lead({ ...this, ...data });
  }
}
