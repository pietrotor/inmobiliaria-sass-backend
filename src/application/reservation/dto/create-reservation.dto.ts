import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsUUID,
  IsNumber,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { SalesChannel } from '@domain/reservation/value-objects/sales-channel.vo';

export class CreateReservationDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  unitIds: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  clientName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  clientNationalId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  clientPhone: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  clientEmail?: string;

  @ApiProperty({ enum: SalesChannel })
  @IsEnum(SalesChannel)
  salesChannel: SalesChannel;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  brokerId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  intentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  executiveId?: string;

  @ApiProperty()
  @IsNumber()
  reservationPaymentAmount: number;

  @ApiProperty({ default: 'USD' })
  @IsString()
  reservationPaymentCurrency: string;

  @ApiProperty()
  @IsDateString()
  reservationPaymentDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  agreementDeadline?: string;
}
