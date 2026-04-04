export interface PaymentPlanProps {
  id: string;
  reservationId: string;
  createdByUserId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PaymentPlan {
  public readonly id: string;
  public readonly reservationId: string;
  public readonly createdByUserId: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: PaymentPlanProps) {
    this.id = props.id;
    this.reservationId = props.reservationId;
    this.createdByUserId = props.createdByUserId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
