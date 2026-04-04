import { CommercialProposal } from '../entities/commercial-proposal.entity';
import { PaginatedResult } from '@domain/common/interfaces/paginated-result.interface';

export const COMMERCIAL_PROPOSAL_REPOSITORY = 'COMMERCIAL_PROPOSAL_REPOSITORY';

export interface CreateCommercialProposalData {
  type: string;
  brokerId?: string;
  executiveId?: string;
  developerId: string;
  clientName: string;
  clientNationalId: string;
  clientPhone: string;
  clientEmail?: string;
  units: any;
  totalPriceUSD: number;
  estimatedCommissionUSD: number;
  generatedAt: Date;
  validUntil: Date;
}

export interface CommercialProposalRepository {
  create(data: CreateCommercialProposalData): Promise<CommercialProposal>;
  findById(id: string): Promise<CommercialProposal | null>;
  findByBrokerId(brokerId: string, limit: number, offset: number): Promise<PaginatedResult<CommercialProposal>>;
  findByDeveloperId(developerId: string, limit: number, offset: number): Promise<PaginatedResult<CommercialProposal>>;
  findByClientNationalId(nationalId: string, developerId: string): Promise<CommercialProposal[]>;
}
