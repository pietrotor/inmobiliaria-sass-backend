import { Payment } from '@domain/payment/entities/payment.entity';
import { PaymentMethod } from '@domain/payment/value-objects/payment-method.vo';
import { PaymentSchema } from '../schema/payment.schema';

export class PaymentMapper {
  static toDomain(schema: PaymentSchema): Payment {
    return new Payment({
      id: schema.id,
      installmentId: schema.installmentId,
      amount: schema.amount,
      receivedDate: schema.receivedDate,
      paymentMethod: schema.paymentMethod as PaymentMethod,
      reference: schema.reference ?? undefined,
      recordedByUserId: schema.recordedByUserId,
      createdAt: schema.createdAt,
    });
  }

  static toPersistence(
    entity: Omit<Payment, 'id' | 'createdAt'>,
  ): Omit<PaymentSchema, 'id' | 'createdAt'> {
    return {
      installmentId: entity.installmentId,
      amount: entity.amount,
      receivedDate: entity.receivedDate,
      paymentMethod: entity.paymentMethod as any,
      reference: entity.reference ?? null,
      recordedByUserId: entity.recordedByUserId,
    };
  }
}
