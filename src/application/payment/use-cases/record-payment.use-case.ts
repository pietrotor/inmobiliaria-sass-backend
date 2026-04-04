import {
  Inject,
  Injectable,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import {
  PAYMENT_REPOSITORY,
  PaymentRepository,
} from '@domain/payment/repositories/payment.repository';
import {
  INSTALLMENT_REPOSITORY,
  InstallmentRepository,
} from '@domain/payment/repositories/installment.repository';
import { InstallmentStatus } from '@domain/payment/value-objects/installment-status.vo';
import { RecordPaymentDto } from '../dto/record-payment.dto';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class RecordPaymentUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepo: PaymentRepository,
    @Inject(INSTALLMENT_REPOSITORY)
    private readonly installmentRepo: InstallmentRepository,
  ) {}

  async execute(installmentId: string, userId: string, dto: RecordPaymentDto) {
    try {
      const installment = await this.installmentRepo.findById(installmentId);
      if (!installment) throw new NotFoundException('Installment not found');

      const payment = await this.paymentRepo.create({
        installmentId,
        amount: dto.amount,
        receivedDate: new Date(dto.receivedDate),
        paymentMethod: dto.paymentMethod,
        reference: dto.reference,
        recordedByUserId: userId,
      });

      const allPayments =
        await this.paymentRepo.findByInstallmentId(installmentId);
      const totalPaid = allPayments.reduce((sum, p) => sum + p.amount, 0);
      if (totalPaid >= installment.amount) {
        await this.installmentRepo.update(installmentId, {
          status: InstallmentStatus.PAID,
        } as any);
      }

      return payment;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'RecordPaymentUseCase');
    }
  }
}
