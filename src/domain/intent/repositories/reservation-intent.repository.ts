import { ReservationIntent } from '../entities/reservation-intent.entity';
import { PaginatedResult } from '@domain/common/interfaces/paginated-result.interface';

export const RESERVATION_INTENT_REPOSITORY = 'RESERVATION_INTENT_REPOSITORY';

export interface CreateReservationIntentData {
  brokerId: string;
  projectId: string;
  unitIds: string[];
  clientName: string;
  clientNationalId: string;
  clientPhone: string;
  clientEmail?: string;
  hasFinancing: boolean;
  hasVisited: boolean;
  status: string;
  deadlineAt: Date;
}

export interface ReservationIntentRepository {
  create(data: CreateReservationIntentData): Promise<ReservationIntent>;
  findById(id: string): Promise<ReservationIntent | null>;
  findActiveByUnitId(unitId: string): Promise<ReservationIntent | null>;
  findActiveByBrokerId(brokerId: string): Promise<ReservationIntent[]>;
  findByProjectId(projectId: string, limit: number, offset: number): Promise<PaginatedResult<ReservationIntent>>;
  findByBrokerId(brokerId: string, limit: number, offset: number): Promise<PaginatedResult<ReservationIntent>>;
  findExpiredActive(): Promise<ReservationIntent[]>;
  findByClientNationalId(nationalId: string, developerId: string, withinDays: number): Promise<ReservationIntent[]>;
  update(id: string, data: Partial<ReservationIntent>): Promise<ReservationIntent>;
  delete(id: string): Promise<void>;
}
