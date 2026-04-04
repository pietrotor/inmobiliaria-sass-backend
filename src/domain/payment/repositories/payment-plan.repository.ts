import { PaymentPlan } from '../entities/payment-plan.entity';

export const PAYMENT_PLAN_REPOSITORY = 'PAYMENT_PLAN_REPOSITORY';

export interface CreatePaymentPlanData {
  reservationId: string;
  createdByUserId: string;
}

export interface PaymentPlanRepository {
  create(data: CreatePaymentPlanData): Promise<PaymentPlan>;
  findById(id: string): Promise<PaymentPlan | null>;
  findByReservationId(reservationId: string): Promise<PaymentPlan | null>;
  delete(id: string): Promise<void>;
}
