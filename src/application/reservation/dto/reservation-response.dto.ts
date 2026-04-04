import { ApiProperty } from '@nestjs/swagger';

export class ReservationResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() unitIds: string[];
  @ApiProperty() clientName: string;
  @ApiProperty() clientNationalId: string;
  @ApiProperty() salesChannel: string;
  @ApiProperty() status: string;
  @ApiProperty() developerId: string;
  @ApiProperty() reservationPaymentAmount: number;
  @ApiProperty() createdAt: Date;
}

export class PaginatedReservationResponseDto {
  @ApiProperty({ type: [ReservationResponseDto] })
  data: ReservationResponseDto[];

  @ApiProperty() total: number;
  @ApiProperty() limit: number;
  @ApiProperty() offset: number;
}
