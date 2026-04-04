import { Reservation } from '../entities/reservation.entity';
import { PaginatedResult } from '@domain/common/interfaces/paginated-result.interface';

export const RESERVATION_REPOSITORY = 'RESERVATION_REPOSITORY';

export interface CreateReservationData {
  unitIds: string[];
  clientName: string;
  clientNationalId: string;
  clientPhone: string;
  clientEmail?: string;
  salesChannel: string;
  brokerId?: string;
  intentId?: string;
  executiveId?: string;
  developerId: string;
  reservationPaymentAmount: number;
  reservationPaymentCurrency: string;
  reservationPaymentDate: Date;
  agreementDeadline?: Date;
  status: string;
}

export interface ReservationRepository {
  create(data: CreateReservationData): Promise<Reservation>;
  findById(id: string): Promise<Reservation | null>;
  findByDeveloperId(developerId: string, limit: number, offset: number): Promise<PaginatedResult<Reservation>>;
  findByUnitId(unitId: string): Promise<Reservation[]>;
  findPendingAgreementDeadlines(): Promise<Reservation[]>;
  update(id: string, data: Partial<Reservation>): Promise<Reservation>;
  delete(id: string): Promise<void>;
}
