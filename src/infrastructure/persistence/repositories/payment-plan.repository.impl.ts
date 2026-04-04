import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { PaymentPlan } from '@domain/payment/entities/payment-plan.entity';
import {
  PaymentPlanRepository,
  CreatePaymentPlanData,
} from '@domain/payment/repositories/payment-plan.repository';
import { DrizzleService } from '../drizzle/drizzle.service';
import { paymentPlans } from '../drizzle/schema/payment-plan.schema';
import { PaymentPlanMapper } from '../drizzle/mappers/payment-plan.mapper';

@Injectable()
export class DrizzlePaymentPlanRepository implements PaymentPlanRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(data: CreatePaymentPlanData): Promise<PaymentPlan> {
    const [created] = await this.drizzle.db
      .insert(paymentPlans)
      .values({
        reservationId: data.reservationId,
        createdByUserId: data.createdByUserId,
      })
      .returning();
    return PaymentPlanMapper.toDomain(created);
  }

  async findById(id: string): Promise<PaymentPlan | null> {
    const [result] = await this.drizzle.db
      .select()
      .from(paymentPlans)
      .where(eq(paymentPlans.id, id));
    return result ? PaymentPlanMapper.toDomain(result) : null;
  }

  async findByReservationId(
    reservationId: string,
  ): Promise<PaymentPlan | null> {
    const [result] = await this.drizzle.db
      .select()
      .from(paymentPlans)
      .where(eq(paymentPlans.reservationId, reservationId));
    return result ? PaymentPlanMapper.toDomain(result) : null;
  }

  async delete(id: string): Promise<void> {
    await this.drizzle.db.delete(paymentPlans).where(eq(paymentPlans.id, id));
  }
}
