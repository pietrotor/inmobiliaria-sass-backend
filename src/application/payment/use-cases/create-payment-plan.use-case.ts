import { Inject, Injectable, HttpException } from '@nestjs/common';
import {
  PAYMENT_PLAN_REPOSITORY,
  PaymentPlanRepository,
} from '@domain/payment/repositories/payment-plan.repository';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class CreatePaymentPlanUseCase {
  constructor(
    @Inject(PAYMENT_PLAN_REPOSITORY)
    private readonly repo: PaymentPlanRepository,
  ) {}

  async execute(reservationId: string, userId: string) {
    try {
      return await this.repo.create({ reservationId, createdByUserId: userId });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'CreatePaymentPlanUseCase');
    }
  }
}
