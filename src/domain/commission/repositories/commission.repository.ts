import { Commission } from '../entities/commission.entity';
import { PaginatedResult } from '@domain/common/interfaces/paginated-result.interface';

export const COMMISSION_REPOSITORY = 'COMMISSION_REPOSITORY';

export interface CreateCommissionData {
  brokerId: string;
  intentId: string;
  reservationId: string;
  developerId: string;
  units: any;
  totalAmountUSD: number;
  status: string;
}

export interface CommissionRepository {
  create(data: CreateCommissionData): Promise<Commission>;
  findById(id: string): Promise<Commission | null>;
  findByBrokerId(brokerId: string, limit: number, offset: number): Promise<PaginatedResult<Commission>>;
  findByDeveloperId(developerId: string, limit: number, offset: number): Promise<PaginatedResult<Commission>>;
  update(id: string, data: Partial<Commission>): Promise<Commission>;
}
