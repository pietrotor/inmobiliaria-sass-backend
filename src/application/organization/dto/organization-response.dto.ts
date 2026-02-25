import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrganizationResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Acme Realty' })
  name: string;

  @ApiProperty({ example: 'acme-realty' })
  slug: string;

  @ApiProperty({ example: 'contact@acmerealty.com' })
  email: string;

  @ApiPropertyOptional({ example: '+584141234567' })
  phone?: string;

  @ApiPropertyOptional({ example: 'Av. Libertador, Caracas, Venezuela' })
  address?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/logos/acme.png' })
  logo?: string;

  @ApiPropertyOptional({
    example: 'Leading real estate company in Caracas since 2010.',
  })
  description?: string;

  @ApiPropertyOptional({ example: 'https://acmerealty.com' })
  website?: string;

  @ApiPropertyOptional({ example: '+584141234567' })
  whatsapp?: string;

  @ApiPropertyOptional({ example: '@acmerealty' })
  instagram?: string;

  @ApiPropertyOptional({ example: 'https://facebook.com/acmerealty' })
  facebook?: string;

  @ApiPropertyOptional({ example: '#2563eb' })
  primaryColor?: string;

  @ApiPropertyOptional({ example: '#f59e0b' })
  secondaryColor?: string;

  @ApiPropertyOptional({ example: 'America/Caracas' })
  timezone?: string;

  @ApiPropertyOptional({ example: 'USD' })
  defaultCurrency?: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2026-02-25T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-02-25T12:00:00.000Z' })
  updatedAt: Date;
}
