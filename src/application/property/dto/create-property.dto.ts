import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsArray,
  IsEmail,
  IsUUID,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PropertyType } from '@domain/property/value-objects/property-type.vo';
import { TransactionType } from '@domain/property/value-objects/transaction-type.vo';
import { Currency } from '@domain/property/value-objects/currency.vo';
import { PropertyCondition } from '@domain/property/value-objects/property-condition.vo';

export class CreatePropertyDto {
  // ── Basic info ──────────────────────────────────────────────────────

  @ApiProperty({
    description: 'Property title',
    example: 'Hermoso departamento 3 ambientes en Palermo',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  title: string;

  @ApiProperty({
    description: 'Property type',
    enum: PropertyType,
    example: PropertyType.APARTMENT,
  })
  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @ApiProperty({
    description: 'Transaction type',
    enum: TransactionType,
    example: TransactionType.SALE,
  })
  @IsEnum(TransactionType)
  transactionType: TransactionType;

  @ApiPropertyOptional({
    description: 'Internal code for the organization',
    example: 'PROP-001',
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  internalCode?: string;

  // ── Pricing ─────────────────────────────────────────────────────────

  @ApiProperty({
    description: 'Currency',
    enum: Currency,
    example: Currency.USD,
  })
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty({
    description: 'Property price',
    example: 150000,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiPropertyOptional({
    description: 'Previous price (for showing discount)',
    example: 170000,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  previousPrice?: number;

  @ApiPropertyOptional({
    description: 'Monthly maintenance fee / expensas',
    example: 25000,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  maintenanceFee?: number;

  // ── Descriptions ────────────────────────────────────────────────────

  @ApiPropertyOptional({
    description: 'Full property description (HTML allowed)',
    example:
      'Amplio departamento con vista al parque. Cocina integrada, pisos de porcelanato...',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Short description for cards/listings',
    example: '3 amb. con balcón, vista al parque, cochera',
    maxLength: 1000,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  shortDescription?: string;

  @ApiPropertyOptional({
    description: 'Private notes (only visible internally)',
    example: 'El dueño acepta permuta por auto',
  })
  @IsString()
  @IsOptional()
  privateNotes?: string;

  // ── Location ────────────────────────────────────────────────────────

  @ApiPropertyOptional({ description: 'Country', example: 'Argentina' })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({
    description: 'State / province',
    example: 'Buenos Aires',
  })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({ description: 'City', example: 'CABA' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({
    description: 'Neighborhood / zone',
    example: 'Palermo',
  })
  @IsString()
  @IsOptional()
  neighborhood?: string;

  @ApiPropertyOptional({
    description: 'Street address',
    example: 'Av. Santa Fe',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: 'Street number', example: '3200' })
  @IsString()
  @IsOptional()
  streetNumber?: string;

  @ApiPropertyOptional({ description: 'Floor number', example: '8' })
  @IsString()
  @IsOptional()
  floor?: string;

  @ApiPropertyOptional({ description: 'Apartment / unit', example: 'A' })
  @IsString()
  @IsOptional()
  apartment?: string;

  @ApiPropertyOptional({ description: 'ZIP / postal code', example: 'C1425' })
  @IsString()
  @IsOptional()
  zipCode?: string;

  @ApiPropertyOptional({ description: 'Latitude', example: -34.5875 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitude', example: -58.4096 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  longitude?: number;

  // ── Physical characteristics ────────────────────────────────────────

  @ApiPropertyOptional({
    description: 'Total area in square meters',
    example: 120,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  totalArea?: number;

  @ApiPropertyOptional({
    description: 'Covered area in square meters',
    example: 95,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  coveredArea?: number;

  @ApiPropertyOptional({
    description: 'Land area in square meters',
    example: 200,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  landArea?: number;

  @ApiPropertyOptional({ description: 'Number of bedrooms', example: 3 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  bedrooms?: number;

  @ApiPropertyOptional({ description: 'Number of full bathrooms', example: 2 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  bathrooms?: number;

  @ApiPropertyOptional({ description: 'Number of half bathrooms', example: 1 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  halfBathrooms?: number;

  @ApiPropertyOptional({ description: 'Number of garages', example: 1 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  garages?: number;

  @ApiPropertyOptional({
    description: 'Number of parking spaces',
    example: 2,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  parkingSpaces?: number;

  @ApiPropertyOptional({ description: 'Number of stories / floors', example: 2 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  stories?: number;

  @ApiPropertyOptional({ description: 'Year built', example: 2020 })
  @IsNumber()
  @IsOptional()
  @Min(1800)
  @Max(2100)
  @Type(() => Number)
  yearBuilt?: number;

  @ApiPropertyOptional({
    description: 'Property condition',
    enum: PropertyCondition,
    example: PropertyCondition.NEW,
  })
  @IsEnum(PropertyCondition)
  @IsOptional()
  condition?: PropertyCondition;

  @ApiPropertyOptional({
    description: 'Orientation (N, S, E, W, NE, etc.)',
    example: 'NE',
  })
  @IsString()
  @IsOptional()
  orientation?: string;

  @ApiPropertyOptional({
    description: 'Disposition (front, back, internal)',
    example: 'front',
  })
  @IsString()
  @IsOptional()
  disposition?: string;

  // ── Amenities / features ────────────────────────────────────────────

  @ApiPropertyOptional({ description: 'Has pool', example: true })
  @IsBoolean()
  @IsOptional()
  hasPool?: boolean;

  @ApiPropertyOptional({ description: 'Has garden', example: true })
  @IsBoolean()
  @IsOptional()
  hasGarden?: boolean;

  @ApiPropertyOptional({ description: 'Has terrace', example: false })
  @IsBoolean()
  @IsOptional()
  hasTerrace?: boolean;

  @ApiPropertyOptional({ description: 'Has balcony', example: true })
  @IsBoolean()
  @IsOptional()
  hasBalcony?: boolean;

  @ApiPropertyOptional({ description: 'Has air conditioning', example: true })
  @IsBoolean()
  @IsOptional()
  hasAirConditioning?: boolean;

  @ApiPropertyOptional({ description: 'Has heating', example: false })
  @IsBoolean()
  @IsOptional()
  hasHeating?: boolean;

  @ApiPropertyOptional({ description: 'Has central heating', example: false })
  @IsBoolean()
  @IsOptional()
  hasCentralHeating?: boolean;

  @ApiPropertyOptional({ description: 'Has fireplace', example: false })
  @IsBoolean()
  @IsOptional()
  hasFireplace?: boolean;

  @ApiPropertyOptional({ description: 'Has built-in closets', example: true })
  @IsBoolean()
  @IsOptional()
  hasClosets?: boolean;

  @ApiPropertyOptional({ description: 'Has laundry room', example: true })
  @IsBoolean()
  @IsOptional()
  hasLaundryRoom?: boolean;

  @ApiPropertyOptional({ description: 'Has security / surveillance', example: true })
  @IsBoolean()
  @IsOptional()
  hasSecurity?: boolean;

  @ApiPropertyOptional({ description: 'Has elevator', example: true })
  @IsBoolean()
  @IsOptional()
  hasElevator?: boolean;

  @ApiPropertyOptional({ description: 'Has gym', example: false })
  @IsBoolean()
  @IsOptional()
  hasGym?: boolean;

  @ApiPropertyOptional({ description: 'Pets allowed', example: true })
  @IsBoolean()
  @IsOptional()
  hasPetsAllowed?: boolean;

  @ApiPropertyOptional({ description: 'Is furnished', example: false })
  @IsBoolean()
  @IsOptional()
  isFurnished?: boolean;

  @ApiPropertyOptional({ description: 'Has rooftop access', example: false })
  @IsBoolean()
  @IsOptional()
  hasRooftop?: boolean;

  @ApiPropertyOptional({ description: 'Has grill / parrilla', example: true })
  @IsBoolean()
  @IsOptional()
  hasGrill?: boolean;

  @ApiPropertyOptional({ description: 'Has solar panels', example: false })
  @IsBoolean()
  @IsOptional()
  hasSolarPanels?: boolean;

  @ApiPropertyOptional({ description: 'Has water tank', example: true })
  @IsBoolean()
  @IsOptional()
  hasWaterTank?: boolean;

  @ApiPropertyOptional({ description: 'Has service room', example: false })
  @IsBoolean()
  @IsOptional()
  hasServiceRoom?: boolean;

  // ── SEO & Web ───────────────────────────────────────────────────────

  @ApiPropertyOptional({
    description: 'Meta title for SEO',
    example: 'Depto 3 amb Palermo - Venta',
  })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  metaTitle?: string;

  @ApiPropertyOptional({
    description: 'Meta description for SEO',
    example: 'Hermoso departamento de 3 ambientes en Palermo con balcón...',
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  metaDescription?: string;

  @ApiPropertyOptional({
    description: 'SEO keywords',
    example: ['departamento', 'palermo', 'venta', '3 ambientes'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  keywords?: string[];

  @ApiPropertyOptional({
    description: 'Video URL (YouTube, Vimeo, etc.)',
    example: 'https://youtube.com/watch?v=abc123',
  })
  @IsString()
  @IsOptional()
  videoUrl?: string;

  @ApiPropertyOptional({
    description: 'Virtual tour URL (Matterport, etc.)',
    example: 'https://my.matterport.com/show/?m=abc123',
  })
  @IsString()
  @IsOptional()
  virtualTourUrl?: string;

  // ── Contact / Agent ─────────────────────────────────────────────────

  @ApiPropertyOptional({
    description: 'Agent user ID (must belong to the organization)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsOptional()
  agentId?: string;

  @ApiPropertyOptional({
    description: 'Contact phone',
    example: '+5491155554444',
  })
  @IsString()
  @IsOptional()
  contactPhone?: string;

  @ApiPropertyOptional({
    description: 'Contact email',
    example: 'ventas@inmobiliaria.com',
  })
  @IsEmail()
  @IsOptional()
  contactEmail?: string;

  @ApiPropertyOptional({
    description: 'Contact WhatsApp number',
    example: '+5491155554444',
  })
  @IsString()
  @IsOptional()
  contactWhatsapp?: string;

  // ── Control ─────────────────────────────────────────────────────────

  @ApiPropertyOptional({
    description: 'Mark as featured property',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}
