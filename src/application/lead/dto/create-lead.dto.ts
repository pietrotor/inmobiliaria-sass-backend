import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  IsUUID,
} from 'class-validator';
import { LeadSource } from '@domain/lead/value-objects/lead-source.vo';

export class CreateLeadDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsNotEmpty()
  nationalId: string;

  @ApiProperty({ example: '+591 70000000' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ example: 'juan@email.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ enum: LeadSource })
  @IsEnum(LeadSource)
  source: LeadSource;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  interestedUnitIds?: string[];

  @ApiPropertyOptional({ example: 'Interested in 2-bedroom apartments' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  assignedExecutiveId?: string;
}
