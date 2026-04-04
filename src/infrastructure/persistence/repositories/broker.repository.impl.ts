import { Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';

import { Broker } from '@domain/broker/entities/broker.entity';
import {
  BrokerRepository,
  CreateBrokerData,
} from '@domain/broker/repositories/broker.repository';
import { DrizzleService } from '../drizzle/drizzle.service';
import { brokers } from '../drizzle/schema/broker.schema';
import { reservationIntents } from '../drizzle/schema/reservation-intent.schema';
import { BrokerMapper } from '../drizzle/mappers/broker.mapper';

@Injectable()
export class DrizzleBrokerRepository implements BrokerRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(data: CreateBrokerData): Promise<Broker> {
    const [created] = await this.drizzle.db
      .insert(brokers)
      .values({
        userId: data.userId,
        plan: data.plan as any,
        status: data.status as any,
        companyName: data.companyName ?? null,
        licenseNumber: data.licenseNumber ?? null,
      })
      .returning();
    return BrokerMapper.toDomain(created);
  }

  async findById(id: string): Promise<Broker | null> {
    const [result] = await this.drizzle.db
      .select()
      .from(brokers)
      .where(eq(brokers.id, id));
    return result ? BrokerMapper.toDomain(result) : null;
  }

  async findByUserId(userId: string): Promise<Broker | null> {
    const [result] = await this.drizzle.db
      .select()
      .from(brokers)
      .where(eq(brokers.userId, userId));
    return result ? BrokerMapper.toDomain(result) : null;
  }

  async findAll(): Promise<Broker[]> {
    const results = await this.drizzle.db.select().from(brokers);
    return results.map(BrokerMapper.toDomain);
  }

  async findByStatus(status: string): Promise<Broker[]> {
    const results = await this.drizzle.db
      .select()
      .from(brokers)
      .where(eq(brokers.status, status as any));
    return results.map(BrokerMapper.toDomain);
  }

  async update(id: string, data: Partial<Broker>): Promise<Broker> {
    const updateData: Record<string, unknown> = {};
    if (data.plan !== undefined) updateData.plan = data.plan;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.companyName !== undefined) updateData.companyName = data.companyName;
    if (data.licenseNumber !== undefined)
      updateData.licenseNumber = data.licenseNumber;

    const [updated] = await this.drizzle.db
      .update(brokers)
      .set(updateData)
      .where(eq(brokers.id, id))
      .returning();
    return BrokerMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.drizzle.db.delete(brokers).where(eq(brokers.id, id));
  }

  async countCancellationsLast30Days(brokerId: string): Promise<number> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [result] = await this.drizzle.db
      .select({ count: sql<number>`count(*)::int` })
      .from(reservationIntents)
      .where(
        sql`${reservationIntents.brokerId} = ${brokerId} AND ${reservationIntents.status} = 'CANCELLED' AND ${reservationIntents.updatedAt} >= ${thirtyDaysAgo}`,
      );
    return result?.count ?? 0;
  }
}
