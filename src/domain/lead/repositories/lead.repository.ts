import { Lead } from '../entities/lead.entity';
import { PaginatedResult } from '@domain/common/interfaces/paginated-result.interface';

export const LEAD_REPOSITORY = 'LEAD_REPOSITORY';

export interface CreateLeadData {
  developerId: string;
  assignedExecutiveId: string | null;
  fullName: string;
  nationalId: string;
  phone: string;
  email?: string;
  source: string;
  status: string;
  interestedUnitIds: string[];
  notes?: string;
}

export interface LeadFilters {
  status?: string;
  assignedExecutiveId?: string;
  nationalId?: string;
}

export interface LeadRepository {
  create(data: CreateLeadData): Promise<Lead>;
  findById(id: string): Promise<Lead | null>;
  findByDeveloperId(
    developerId: string,
    limit: number,
    offset: number,
    filters?: LeadFilters,
  ): Promise<PaginatedResult<Lead>>;
  findByNationalIdAndDeveloper(
    nationalId: string,
    developerId: string,
  ): Promise<Lead | null>;
  update(id: string, data: Partial<Lead>): Promise<Lead>;
  delete(id: string): Promise<void>;
}
