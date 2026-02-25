import { ApiProperty } from '@nestjs/swagger';

export class CountryResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Venezuela' })
  name: string;

  @ApiProperty({ example: 'VE' })
  code: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2026-02-25T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-02-25T12:00:00.000Z' })
  updatedAt: Date;
}

export class CityResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Caracas' })
  name: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  countryId: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2026-02-25T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-02-25T12:00:00.000Z' })
  updatedAt: Date;
}

export class NeighborhoodResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Las Mercedes' })
  name: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  cityId: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2026-02-25T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-02-25T12:00:00.000Z' })
  updatedAt: Date;
}

export class MessageResponseDto {
  @ApiProperty({ example: 'Operation completed successfully' })
  message: string;
}
