import { ProposalType } from '../value-objects/proposal-type.vo';

export interface ProposalUnitSnapshot {
  unitId: string;
  identifier: string;
  priceUSD: number;
  commissionPct: number;
}

export interface CommercialProposalProps {
  id: string;
  type: ProposalType;
  brokerId?: string;
  executiveId?: string;
  developerId: string;
  clientName: string;
  clientNationalId: string;
  clientPhone: string;
  clientEmail?: string;
  units: ProposalUnitSnapshot[];
  totalPriceUSD: number;
  estimatedCommissionUSD: number;
  generatedAt: Date;
  validUntil: Date;
}

export class CommercialProposal {
  public readonly id: string;
  public readonly type: ProposalType;
  public readonly brokerId?: string;
  public readonly executiveId?: string;
  public readonly developerId: string;
  public readonly clientName: string;
  public readonly clientNationalId: string;
  public readonly clientPhone: string;
  public readonly clientEmail?: string;
  public readonly units: ProposalUnitSnapshot[];
  public readonly totalPriceUSD: number;
  public readonly estimatedCommissionUSD: number;
  public readonly generatedAt: Date;
  public readonly validUntil: Date;

  constructor(props: CommercialProposalProps) {
    this.id = props.id;
    this.type = props.type;
    this.brokerId = props.brokerId;
    this.executiveId = props.executiveId;
    this.developerId = props.developerId;
    this.clientName = props.clientName;
    this.clientNationalId = props.clientNationalId;
    this.clientPhone = props.clientPhone;
    this.clientEmail = props.clientEmail;
    this.units = props.units;
    this.totalPriceUSD = props.totalPriceUSD;
    this.estimatedCommissionUSD = props.estimatedCommissionUSD;
    this.generatedAt = props.generatedAt;
    this.validUntil = props.validUntil;
  }

  isExpired(): boolean {
    return new Date() > this.validUntil;
  }

  isBrokerProposal(): boolean {
    return this.type === ProposalType.BROKER;
  }
}
