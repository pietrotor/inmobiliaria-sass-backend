import { Injectable } from '@nestjs/common';
import { eq, and, asc, lt } from 'drizzle-orm';

import { Installment } from '@domain/payment/entities/installment.entity';
import {
  InstallmentRepository,
  CreateInstallmentData,
} from '@domain/payment/repositories/installment.repository';
import { DrizzleService } from '../drizzle/drizzle.service';
import { installments } from '../drizzle/schema/installment.schema';
import { InstallmentMapper } from '../drizzle/mappers/installment.mapper';

@Injectable()
export class DrizzleInstallmentRepository implements InstallmentRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(data: CreateInstallmentData): Promise<Installment> {
    const [created] = await this.drizzle.db
      .insert(installments)
      .values({
        paymentPlanId: data.paymentPlanId,
        description: data.description,
        amount: data.amount,
        currency: data.currency,
        dueDate: data.dueDate,
        status: data.status as any,
      })
      .returning();
    return InstallmentMapper.toDomain(created);
  }

  async findById(id: string): Promise<Installment | null> {
    const [result] = await this.drizzle.db
      .select()
      .from(installments)
      .where(eq(installments.id, id));
    return result ? InstallmentMapper.toDomain(result) : null;
  }

  async findByPaymentPlanId(paymentPlanId: string): Promise<Installment[]> {
    const results = await this.drizzle.db
      .select()
      .from(installments)
      .where(eq(installments.paymentPlanId, paymentPlanId))
      .orderBy(asc(installments.dueDate));
    return results.map(InstallmentMapper.toDomain);
  }

  async findOverdueOrDueSoon(daysBefore: number): Promise<Installment[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysBefore);

    const results = await this.drizzle.db
      .select()
      .from(installments)
      .where(
        and(
          eq(installments.status, 'PENDING' as any),
          lt(installments.dueDate, futureDate),
        ),
      )
      .orderBy(asc(installments.dueDate));
    return results.map(InstallmentMapper.toDomain);
  }

  async update(id: string, data: Partial<Installment>): Promise<Installment> {
    const updateData: Record<string, unknown> = {};
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.currency !== undefined) updateData.currency = data.currency;
    if (data.dueDate !== undefined) updateData.dueDate = data.dueDate;
    if (data.status !== undefined) updateData.status = data.status;

    const [updated] = await this.drizzle.db
      .update(installments)
      .set(updateData)
      .where(eq(installments.id, id))
      .returning();
    return InstallmentMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.drizzle.db
      .delete(installments)
      .where(eq(installments.id, id));
  }
}
