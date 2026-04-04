import { Injectable } from '@nestjs/common';
import { eq, desc } from 'drizzle-orm';

import { Payment } from '@domain/payment/entities/payment.entity';
import {
  PaymentRepository,
  CreatePaymentData,
} from '@domain/payment/repositories/payment.repository';
import { DrizzleService } from '../drizzle/drizzle.service';
import { payments } from '../drizzle/schema/payment.schema';
import { installments } from '../drizzle/schema/installment.schema';
import { PaymentMapper } from '../drizzle/mappers/payment.mapper';

@Injectable()
export class DrizzlePaymentRepository implements PaymentRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(data: CreatePaymentData): Promise<Payment> {
    const [created] = await this.drizzle.db
      .insert(payments)
      .values({
        installmentId: data.installmentId,
        amount: data.amount,
        receivedDate: data.receivedDate,
        paymentMethod: data.paymentMethod as any,
        reference: data.reference ?? null,
        recordedByUserId: data.recordedByUserId,
      })
      .returning();
    return PaymentMapper.toDomain(created);
  }

  async findById(id: string): Promise<Payment | null> {
    const [result] = await this.drizzle.db
      .select()
      .from(payments)
      .where(eq(payments.id, id));
    return result ? PaymentMapper.toDomain(result) : null;
  }

  async findByInstallmentId(installmentId: string): Promise<Payment[]> {
    const results = await this.drizzle.db
      .select()
      .from(payments)
      .where(eq(payments.installmentId, installmentId))
      .orderBy(desc(payments.createdAt));
    return results.map(PaymentMapper.toDomain);
  }

  async findByPaymentPlanId(paymentPlanId: string): Promise<Payment[]> {
    const results = await this.drizzle.db
      .select({ payment: payments })
      .from(payments)
      .innerJoin(installments, eq(payments.installmentId, installments.id))
      .where(eq(installments.paymentPlanId, paymentPlanId))
      .orderBy(desc(payments.createdAt));
    return results.map((r) => PaymentMapper.toDomain(r.payment));
  }
}
