import { Injectable } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';

import { BrokerProjectAccess } from '@domain/broker/entities/broker-project-access.entity';
import {
  BrokerProjectAccessRepository,
  CreateBrokerProjectAccessData,
} from '@domain/broker/repositories/broker-project-access.repository';
import { DrizzleService } from '../drizzle/drizzle.service';
import { brokerProjectAccess } from '../drizzle/schema/broker-project-access.schema';
import { BrokerProjectAccessMapper } from '../drizzle/mappers/broker-project-access.mapper';

@Injectable()
export class DrizzleBrokerProjectAccessRepository
  implements BrokerProjectAccessRepository
{
  constructor(private readonly drizzle: DrizzleService) {}

  async create(
    data: CreateBrokerProjectAccessData,
  ): Promise<BrokerProjectAccess> {
    const [created] = await this.drizzle.db
      .insert(brokerProjectAccess)
      .values({
        brokerId: data.brokerId,
        projectId: data.projectId,
        status: data.status as any,
      })
      .returning();
    return BrokerProjectAccessMapper.toDomain(created);
  }

  async findById(id: string): Promise<BrokerProjectAccess | null> {
    const [result] = await this.drizzle.db
      .select()
      .from(brokerProjectAccess)
      .where(eq(brokerProjectAccess.id, id));
    return result ? BrokerProjectAccessMapper.toDomain(result) : null;
  }

  async findByBrokerAndProject(
    brokerId: string,
    projectId: string,
  ): Promise<BrokerProjectAccess | null> {
    const [result] = await this.drizzle.db
      .select()
      .from(brokerProjectAccess)
      .where(
        and(
          eq(brokerProjectAccess.brokerId, brokerId),
          eq(brokerProjectAccess.projectId, projectId),
        ),
      );
    return result ? BrokerProjectAccessMapper.toDomain(result) : null;
  }

  async findByProject(projectId: string): Promise<BrokerProjectAccess[]> {
    const results = await this.drizzle.db
      .select()
      .from(brokerProjectAccess)
      .where(eq(brokerProjectAccess.projectId, projectId));
    return results.map(BrokerProjectAccessMapper.toDomain);
  }

  async findByBroker(brokerId: string): Promise<BrokerProjectAccess[]> {
    const results = await this.drizzle.db
      .select()
      .from(brokerProjectAccess)
      .where(eq(brokerProjectAccess.brokerId, brokerId));
    return results.map(BrokerProjectAccessMapper.toDomain);
  }

  async update(
    id: string,
    data: Partial<BrokerProjectAccess>,
  ): Promise<BrokerProjectAccess> {
    const updateData: Record<string, unknown> = {};
    if (data.status !== undefined) updateData.status = data.status;

    const [updated] = await this.drizzle.db
      .update(brokerProjectAccess)
      .set(updateData)
      .where(eq(brokerProjectAccess.id, id))
      .returning();
    return BrokerProjectAccessMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.drizzle.db
      .delete(brokerProjectAccess)
      .where(eq(brokerProjectAccess.id, id));
  }
}
