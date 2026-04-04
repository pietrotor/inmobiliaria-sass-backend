import { LeadStatusHistory } from '../entities/lead-status-history.entity';

export const LEAD_STATUS_HISTORY_REPOSITORY =
  'LEAD_STATUS_HISTORY_REPOSITORY';

export interface CreateLeadStatusHistoryData {
  leadId: string;
  fromStatus: string;
  toStatus: string;
  changedByUserId: string;
}

export interface LeadStatusHistoryRepository {
  create(data: CreateLeadStatusHistoryData): Promise<LeadStatusHistory>;
  findByLeadId(leadId: string): Promise<LeadStatusHistory[]>;
}
