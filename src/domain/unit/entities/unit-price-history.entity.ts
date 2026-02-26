export interface UnitPriceHistoryProps {
  id: string;
  unitId: string;
  previousPriceUSD: number;
  newPriceUSD: number;
  changedByUserId: string;
  reason: string;
  createdAt: Date;
}

export class UnitPriceHistory {
  public readonly id: string;
  public readonly unitId: string;
  public readonly previousPriceUSD: number;
  public readonly newPriceUSD: number;
  public readonly changedByUserId: string;
  public readonly reason: string;
  public readonly createdAt: Date;

  constructor(props: UnitPriceHistoryProps) {
    this.id = props.id;
    this.unitId = props.unitId;
    this.previousPriceUSD = props.previousPriceUSD;
    this.newPriceUSD = props.newPriceUSD;
    this.changedByUserId = props.changedByUserId;
    this.reason = props.reason;
    this.createdAt = props.createdAt;
  }

  get priceDelta(): number {
    return this.newPriceUSD - this.previousPriceUSD;
  }
}
