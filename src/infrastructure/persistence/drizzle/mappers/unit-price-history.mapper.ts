import { UnitPriceHistory } from '@domain/unit/entities/unit-price-history.entity';
import { UnitPriceHistorySchema } from '../schema/unit-price-history.schema';

export class UnitPriceHistoryMapper {
  static toDomain(schema: UnitPriceHistorySchema): UnitPriceHistory {
    return new UnitPriceHistory({
      id: schema.id,
      unitId: schema.unitId,
      previousPriceUSD: schema.previousPriceUSD,
      newPriceUSD: schema.newPriceUSD,
      changedByUserId: schema.changedByUserId,
      reason: schema.reason,
      createdAt: schema.createdAt,
    });
  }

  static toPersistence(
    entity: Omit<UnitPriceHistory, 'id' | 'createdAt' | 'priceDelta'>,
  ): Omit<UnitPriceHistorySchema, 'id' | 'createdAt'> {
    return {
      unitId: entity.unitId,
      previousPriceUSD: entity.previousPriceUSD,
      newPriceUSD: entity.newPriceUSD,
      changedByUserId: entity.changedByUserId,
      reason: entity.reason,
    };
  }
}
