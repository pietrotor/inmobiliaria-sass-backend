import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsBoolean,
  Min,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { PropertyType } from '@domain/property/value-objects/property-type.vo';
import { TransactionType } from '@domain/property/value-objects/transaction-type.vo';
import { PropertyStatus } from '@domain/property/value-objects/property-status.vo';
import { Currency } from '@domain/property/value-objects/currency.vo';

export class FilterPropertiesDto {
  @ApiPropertyOptional({
    description: 'Filter by organization ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsOptional()
  organizationId?: string;

  @ApiPropertyOptional({
    description: 'Filter by property type',
    enum: PropertyType,
  })
  @IsEnum(PropertyType)
  @IsOptional()
  propertyType?: PropertyType;

  @ApiPropertyOptional({
    description: 'Filter by transaction type',
    enum: TransactionType,
  })
  @IsEnum(TransactionType)
  @IsOptional()
  transactionType?: TransactionType;

  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: PropertyStatus,
  })
  @IsEnum(PropertyStatus)
  @IsOptional()
  status?: PropertyStatus;

  @ApiPropertyOptional({
    description: 'Filter by currency',
    enum: Currency,
  })
  @IsEnum(Currency)
  @IsOptional()
  currency?: Currency;

  @ApiPropertyOptional({ description: 'Minimum price', example: 50000 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Maximum price', example: 300000 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Filter by city', example: 'CABA' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({
    description: 'Filter by state',
    example: 'Buenos Aires',
  })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({
    description: 'Filter by neighborhood',
    example: 'Palermo',
  })
  @IsString()
  @IsOptional()
  neighborhood?: string;

  @ApiPropertyOptional({
    description: 'Minimum bedrooms',
    example: 2,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  bedrooms?: number;

  @ApiPropertyOptional({
    description: 'Minimum bathrooms',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  bathrooms?: number;

  @ApiPropertyOptional({
    description: 'Minimum total area (m²)',
    example: 50,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  minTotalArea?: number;

  @ApiPropertyOptional({
    description: 'Maximum total area (m²)',
    example: 200,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  maxTotalArea?: number;

  @ApiPropertyOptional({ description: 'Only featured properties' })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isFeatured?: boolean;

  @ApiPropertyOptional({ description: 'Only published properties' })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isPublished?: boolean;

  @ApiPropertyOptional({
    description: 'Free text search across title, description, address, city',
    example: 'palermo balcón',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    default: 1,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({
    description: 'Items per page',
    example: 20,
    default: 20,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Sort field',
    example: 'price',
    enum: [
      'price',
      'title',
      'bedrooms',
      'totalArea',
      'viewCount',
      'publishedAt',
      'createdAt',
    ],
  })
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'desc',
    enum: ['asc', 'desc'],
  })
  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc';
}
