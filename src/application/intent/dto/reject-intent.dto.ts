import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RejectionReason } from '@domain/intent/value-objects/rejection-reason.vo';

export class RejectIntentDto {
  @ApiProperty({ enum: RejectionReason })
  @IsEnum(RejectionReason)
  reason: RejectionReason;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;
}
