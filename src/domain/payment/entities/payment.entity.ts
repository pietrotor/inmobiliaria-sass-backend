import { PaymentMethod } from '../value-objects/payment-method.vo';

export interface PaymentProps {
  id: string;
  installmentId: string;
  amount: number;
  receivedDate: Date;
  paymentMethod: PaymentMethod;
  reference?: string;
  recordedByUserId: string;
  createdAt: Date;
}

export class Payment {
  public readonly id: string;
  public readonly installmentId: string;
  public readonly amount: number;
  public readonly receivedDate: Date;
  public readonly paymentMethod: PaymentMethod;
  public readonly reference?: string;
  public readonly recordedByUserId: string;
  public readonly createdAt: Date;

  constructor(props: PaymentProps) {
    this.id = props.id;
    this.installmentId = props.installmentId;
    this.amount = props.amount;
    this.receivedDate = props.receivedDate;
    this.paymentMethod = props.paymentMethod;
    this.reference = props.reference;
    this.recordedByUserId = props.recordedByUserId;
    this.createdAt = props.createdAt;
  }
}
