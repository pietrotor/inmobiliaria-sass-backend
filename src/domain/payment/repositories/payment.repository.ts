import { Payment } from '../entities/payment.entity';

export const PAYMENT_REPOSITORY = 'PAYMENT_REPOSITORY';

export interface CreatePaymentData {
  installmentId: string;
  amount: number;
  receivedDate: Date;
  paymentMethod: string;
  reference?: string;
  recordedByUserId: string;
}

export interface PaymentRepository {
  create(data: CreatePaymentData): Promise<Payment>;
  findById(id: string): Promise<Payment | null>;
  findByInstallmentId(installmentId: string): Promise<Payment[]>;
  findByPaymentPlanId(paymentPlanId: string): Promise<Payment[]>;
}
