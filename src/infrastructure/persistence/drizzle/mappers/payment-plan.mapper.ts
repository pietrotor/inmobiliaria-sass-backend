import { PaymentPlan } from '@domain/payment/entities/payment-plan.entity';
import { PaymentPlanSchema } from '../schema/payment-plan.schema';

export class PaymentPlanMapper {
  static toDomain(schema: PaymentPlanSchema): PaymentPlan {
    return new PaymentPlan({
      id: schema.id,
      reservationId: schema.reservationId,
      createdByUserId: schema.createdByUserId,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  static toPersistence(
    entity: Omit<PaymentPlan, 'id' | 'createdAt' | 'updatedAt'>,
  ): Omit<PaymentPlanSchema, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      reservationId: entity.reservationId,
      createdByUserId: entity.createdByUserId,
    };
  }
}
