import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaymentPlanResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() reservationId: string;
  @ApiProperty() createdAt: Date;
}

export class InstallmentResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() description: string;
  @ApiProperty() amount: number;
  @ApiProperty() currency: string;
  @ApiProperty() dueDate: Date;
  @ApiProperty() status: string;
}

export class PaymentResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() installmentId: string;
  @ApiProperty() amount: number;
  @ApiProperty() receivedDate: Date;
  @ApiProperty() paymentMethod: string;
  @ApiPropertyOptional() reference?: string;
}

export class DebtStatusDto {
  @ApiProperty() totalAmount: number;
  @ApiProperty() totalPaid: number;
  @ApiProperty() totalRemaining: number;
  @ApiProperty() overdueCount: number;
}
