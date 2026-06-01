import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UnitTypologyResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  projectId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  unitType: string;

  @ApiPropertyOptional()
  basePriceUsd: number | null;

  @ApiProperty()
  baseAttributes: Record<string, unknown>;

  @ApiPropertyOptional()
  description: string | null;

  @ApiProperty()
  sortOrder: number;

  @ApiProperty()
  unitCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
