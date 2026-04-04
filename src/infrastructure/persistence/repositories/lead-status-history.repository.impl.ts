import { Injectable } from '@nestjs/common';
import { eq, desc } from 'drizzle-orm';

import { LeadStatusHistory } from '@domain/lead/entities/lead-status-history.entity';
import {
  LeadStatusHistoryRepository,
  CreateLeadStatusHistoryData,
} from '@domain/lead/repositories/lead-status-history.repository';
import { DrizzleService } from '../drizzle/drizzle.service';
import { leadStatusHistory } from '../drizzle/schema/lead-status-history.schema';
import { LeadStatusHistoryMapper } from '../drizzle/mappers/lead-status-history.mapper';

@Injectable()
export class DrizzleLeadStatusHistoryRepository
  implements LeadStatusHistoryRepository
{
  constructor(private readonly drizzle: DrizzleService) {}

  async create(data: CreateLeadStatusHistoryData): Promise<LeadStatusHistory> {
    const [created] = await this.drizzle.db
      .insert(leadStatusHistory)
      .values({
        leadId: data.leadId,
        fromStatus: data.fromStatus as any,
        toStatus: data.toStatus as any,
        changedByUserId: data.changedByUserId,
      })
      .returning();
    return LeadStatusHistoryMapper.toDomain(created);
  }

  async findByLeadId(leadId: string): Promise<LeadStatusHistory[]> {
    const results = await this.drizzle.db
      .select()
      .from(leadStatusHistory)
      .where(eq(leadStatusHistory.leadId, leadId))
      .orderBy(desc(leadStatusHistory.changedAt));
    return results.map(LeadStatusHistoryMapper.toDomain);
  }
}
