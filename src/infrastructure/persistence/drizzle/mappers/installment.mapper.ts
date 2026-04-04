import { Installment } from '@domain/payment/entities/installment.entity';
import { InstallmentStatus } from '@domain/payment/value-objects/installment-status.vo';
import { InstallmentSchema } from '../schema/installment.schema';

export class InstallmentMapper {
  static toDomain(schema: InstallmentSchema): Installment {
    return new Installment({
      id: schema.id,
      paymentPlanId: schema.paymentPlanId,
      description: schema.description,
      amount: schema.amount,
      currency: schema.currency,
      dueDate: schema.dueDate,
      status: schema.status as InstallmentStatus,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  static toPersistence(
    entity: Omit<Installment, 'id' | 'createdAt' | 'updatedAt'>,
  ): Omit<InstallmentSchema, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      paymentPlanId: entity.paymentPlanId,
      description: entity.description,
      amount: entity.amount,
      currency: entity.currency,
      dueDate: entity.dueDate,
      status: entity.status as any,
    };
  }
}
