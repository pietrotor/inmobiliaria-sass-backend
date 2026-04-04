import { Installment } from '../entities/installment.entity';

export const INSTALLMENT_REPOSITORY = 'INSTALLMENT_REPOSITORY';

export interface CreateInstallmentData {
  paymentPlanId: string;
  description: string;
  amount: number;
  currency: string;
  dueDate: Date;
  status: string;
}

export interface InstallmentRepository {
  create(data: CreateInstallmentData): Promise<Installment>;
  findById(id: string): Promise<Installment | null>;
  findByPaymentPlanId(paymentPlanId: string): Promise<Installment[]>;
  findOverdueOrDueSoon(daysBefore: number): Promise<Installment[]>;
  update(id: string, data: Partial<Installment>): Promise<Installment>;
  delete(id: string): Promise<void>;
}
