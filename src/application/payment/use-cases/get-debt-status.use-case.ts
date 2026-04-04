import {
  Inject,
  Injectable,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import {
  INSTALLMENT_REPOSITORY,
  InstallmentRepository,
} from '@domain/payment/repositories/installment.repository';
import {
  PAYMENT_REPOSITORY,
  PaymentRepository,
} from '@domain/payment/repositories/payment.repository';
import {
  PAYMENT_PLAN_REPOSITORY,
  PaymentPlanRepository,
} from '@domain/payment/repositories/payment-plan.repository';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class GetDebtStatusUseCase {
  constructor(
    @Inject(PAYMENT_PLAN_REPOSITORY)
    private readonly planRepo: PaymentPlanRepository,
    @Inject(INSTALLMENT_REPOSITORY)
    private readonly installmentRepo: InstallmentRepository,
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepo: PaymentRepository,
  ) {}

  async execute(paymentPlanId: string) {
    try {
      const plan = await this.planRepo.findById(paymentPlanId);
      if (!plan) throw new NotFoundException('Payment plan not found');

      const installments =
        await this.installmentRepo.findByPaymentPlanId(paymentPlanId);
      const payments =
        await this.paymentRepo.findByPaymentPlanId(paymentPlanId);

      const totalAmount = installments.reduce((sum, i) => sum + i.amount, 0);
      const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
      const overdueCount = installments.filter((i) => i.isOverdue()).length;

      return {
        totalAmount,
        totalPaid,
        totalRemaining: totalAmount - totalPaid,
        overdueCount,
        installments,
        payments,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'GetDebtStatusUseCase');
    }
  }
}
