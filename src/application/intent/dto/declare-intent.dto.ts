import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsUUID,
  IsBoolean,
} from 'class-validator';

export class DeclareIntentDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  unitIds: string[];

  @ApiProperty()
  @IsUUID()
  projectId: string;

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

  @ApiProperty({ default: false })
  @IsBoolean()
  hasFinancing: boolean;

  @ApiProperty({ default: false })
  @IsBoolean()
  hasVisited: boolean;
}
