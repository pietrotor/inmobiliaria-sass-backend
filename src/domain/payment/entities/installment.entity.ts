import { InstallmentStatus } from '../value-objects/installment-status.vo';

export interface InstallmentProps {
  id: string;
  paymentPlanId: string;
  description: string;
  amount: number;
  currency: string;
  dueDate: Date;
  status: InstallmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class Installment {
  public readonly id: string;
  public readonly paymentPlanId: string;
  public readonly description: string;
  public readonly amount: number;
  public readonly currency: string;
  public readonly dueDate: Date;
  public readonly status: InstallmentStatus;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: InstallmentProps) {
    this.id = props.id;
    this.paymentPlanId = props.paymentPlanId;
    this.description = props.description;
    this.amount = props.amount;
    this.currency = props.currency;
    this.dueDate = props.dueDate;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  isOverdue(): boolean {
    return this.status === InstallmentStatus.PENDING && new Date() > this.dueDate;
  }

  markAsPaid(): Installment {
    return new Installment({ ...this, status: InstallmentStatus.PAID });
  }

  markAsOverdue(): Installment {
    return new Installment({ ...this, status: InstallmentStatus.OVERDUE });
  }
}
