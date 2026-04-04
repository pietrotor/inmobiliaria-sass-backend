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
  PAYMENT_PLAN_REPOSITORY,
  PaymentPlanRepository,
} from '@domain/payment/repositories/payment-plan.repository';
import { InstallmentStatus } from '@domain/payment/value-objects/installment-status.vo';
import { AddInstallmentDto } from '../dto/add-installment.dto';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class AddInstallmentUseCase {
  constructor(
    @Inject(INSTALLMENT_REPOSITORY)
    private readonly installmentRepo: InstallmentRepository,
    @Inject(PAYMENT_PLAN_REPOSITORY)
    private readonly planRepo: PaymentPlanRepository,
  ) {}

  async execute(paymentPlanId: string, dto: AddInstallmentDto) {
    try {
      const plan = await this.planRepo.findById(paymentPlanId);
      if (!plan) throw new NotFoundException('Payment plan not found');

      return await this.installmentRepo.create({
        paymentPlanId,
        description: dto.description,
        amount: dto.amount,
        currency: dto.currency,
        dueDate: new Date(dto.dueDate),
        status: InstallmentStatus.PENDING,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'AddInstallmentUseCase');
    }
  }
}
