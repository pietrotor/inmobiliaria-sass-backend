import { UnitPriceHistory } from '../entities/unit-price-history.entity';

export const UNIT_PRICE_HISTORY_REPOSITORY = 'UNIT_PRICE_HISTORY_REPOSITORY';

export interface CreateUnitPriceHistoryData {
  unitId: string;
  previousPriceUSD: number;
  newPriceUSD: number;
  changedByUserId: string;
  reason: string;
}

export interface UnitPriceHistoryRepository {
  create(data: CreateUnitPriceHistoryData): Promise<UnitPriceHistory>;
  findByUnitId(unitId: string): Promise<UnitPriceHistory[]>;
  deleteByUnitId(unitId: string): Promise<void>;
}
