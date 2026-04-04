import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { PaymentsController } from './payments.controller';

import { CreatePaymentPlanUseCase } from '@application/payment/use-cases/create-payment-plan.use-case';
import { AddInstallmentUseCase } from '@application/payment/use-cases/add-installment.use-case';
import { RecordPaymentUseCase } from '@application/payment/use-cases/record-payment.use-case';
import { GetDebtStatusUseCase } from '@application/payment/use-cases/get-debt-status.use-case';

import { DrizzleModule } from '@infrastructure/persistence/drizzle/drizzle.module';
import { DrizzlePaymentPlanRepository } from '@infrastructure/persistence/repositories/payment-plan.repository.impl';
import { DrizzleInstallmentRepository } from '@infrastructure/persistence/repositories/installment.repository.impl';
import { DrizzlePaymentRepository } from '@infrastructure/persistence/repositories/payment.repository.impl';
import { PAYMENT_PLAN_REPOSITORY } from '@domain/payment/repositories/payment-plan.repository';
import { INSTALLMENT_REPOSITORY } from '@domain/payment/repositories/installment.repository';
import { PAYMENT_REPOSITORY } from '@domain/payment/repositories/payment.repository';

import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DrizzleModule,
    UsersModule,
  ],
  controllers: [PaymentsController],
  providers: [
    CreatePaymentPlanUseCase,
    AddInstallmentUseCase,
    RecordPaymentUseCase,
    GetDebtStatusUseCase,
    {
      provide: PAYMENT_PLAN_REPOSITORY,
      useClass: DrizzlePaymentPlanRepository,
    },
    {
      provide: INSTALLMENT_REPOSITORY,
      useClass: DrizzleInstallmentRepository,
    },
    {
      provide: PAYMENT_REPOSITORY,
      useClass: DrizzlePaymentRepository,
    },
  ],
  exports: [PAYMENT_PLAN_REPOSITORY, INSTALLMENT_REPOSITORY, PAYMENT_REPOSITORY],
})
export class PaymentsModule {}
