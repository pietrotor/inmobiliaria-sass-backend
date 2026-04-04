import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CommissionResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() brokerId: string;
  @ApiProperty() reservationId: string;
  @ApiProperty() totalAmountUSD: number;
  @ApiProperty() status: string;
  @ApiPropertyOptional() paidAt?: Date;
  @ApiProperty() createdAt: Date;
}

export class PaginatedCommissionResponseDto {
  @ApiProperty({ type: [CommissionResponseDto] })
  data: CommissionResponseDto[];

  @ApiProperty() total: number;
  @ApiProperty() limit: number;
  @ApiProperty() offset: number;
}
