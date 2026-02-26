import { Injectable } from '@nestjs/common';
import { eq, desc } from 'drizzle-orm';

import { UnitPriceHistory } from '@domain/unit/entities/unit-price-history.entity';
import {
  UnitPriceHistoryRepository,
  CreateUnitPriceHistoryData,
} from '@domain/unit/repositories/unit-price-history.repository';
import { DrizzleService } from '../drizzle/drizzle.service';
import { unitPriceHistory } from '../drizzle/schema/unit-price-history.schema';
import { UnitPriceHistoryMapper } from '../drizzle/mappers/unit-price-history.mapper';

@Injectable()
export class DrizzleUnitPriceHistoryRepository
  implements UnitPriceHistoryRepository
{
  constructor(private readonly drizzle: DrizzleService) {}

  async create(data: CreateUnitPriceHistoryData): Promise<UnitPriceHistory> {
    const [created] = await this.drizzle.db
      .insert(unitPriceHistory)
      .values({
        unitId: data.unitId,
        previousPriceUSD: data.previousPriceUSD,
        newPriceUSD: data.newPriceUSD,
        changedByUserId: data.changedByUserId,
        reason: data.reason,
      })
      .returning();

    return UnitPriceHistoryMapper.toDomain(created);
  }

  async findByUnitId(unitId: string): Promise<UnitPriceHistory[]> {
    const results = await this.drizzle.db
      .select()
      .from(unitPriceHistory)
      .where(eq(unitPriceHistory.unitId, unitId))
      .orderBy(desc(unitPriceHistory.createdAt));

    return results.map(UnitPriceHistoryMapper.toDomain);
  }

  async deleteByUnitId(unitId: string): Promise<void> {
    await this.drizzle.db
      .delete(unitPriceHistory)
      .where(eq(unitPriceHistory.unitId, unitId));
  }
}
