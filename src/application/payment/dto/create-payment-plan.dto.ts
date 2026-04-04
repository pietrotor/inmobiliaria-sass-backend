import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreatePaymentPlanDto {
  @ApiProperty()
  @IsUUID()
  reservationId: string;
}
