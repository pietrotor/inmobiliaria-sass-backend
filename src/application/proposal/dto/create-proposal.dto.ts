import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsUUID,
} from 'class-validator';

export class CreateProposalDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  clientName: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsNotEmpty()
  clientNationalId: string;

  @ApiProperty({ example: '+591 70000000' })
  @IsString()
  @IsNotEmpty()
  clientPhone: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  clientEmail?: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  unitIds: string[];
}
