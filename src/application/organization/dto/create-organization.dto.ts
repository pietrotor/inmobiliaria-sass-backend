import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { Currency } from '@domain/property/value-objects/currency.vo';

export class CreateOrganizationDto {
  @ApiProperty({
    description: 'Organization name',
    example: 'Acme Realty',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Organization email',
    example: 'contact@acmerealty.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({
    description: 'Organization phone number',
    example: '+584141234567',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Organization address',
    example: 'Av. Libertador, Caracas, Venezuela',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    description: 'Description of the organization',
    example: 'Leading real estate company in Caracas since 2010.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Organization website URL',
    example: 'https://acmerealty.com',
  })
  @IsString()
  @IsOptional()
  website?: string;

  @ApiPropertyOptional({
    description: 'WhatsApp contact number',
    example: '+584141234567',
  })
  @IsString()
  @IsOptional()
  whatsapp?: string;

  @ApiPropertyOptional({
    description: 'Instagram handle or URL',
    example: '@acmerealty',
  })
  @IsString()
  @IsOptional()
  instagram?: string;

  @ApiPropertyOptional({
    description: 'Facebook page URL',
    example: 'https://facebook.com/acmerealty',
  })
  @IsString()
  @IsOptional()
  facebook?: string;

  @ApiPropertyOptional({
    description: 'Primary brand color (hex)',
    example: '#2563eb',
  })
  @IsString()
  @IsOptional()
  @Matches(/^#[0-9a-fA-F]{6}$/, {
    message: 'primaryColor must be a valid hex color (e.g. #2563eb)',
  })
  primaryColor?: string;

  @ApiPropertyOptional({
    description: 'Secondary brand color (hex)',
    example: '#f59e0b',
  })
  @IsString()
  @IsOptional()
  @Matches(/^#[0-9a-fA-F]{6}$/, {
    message: 'secondaryColor must be a valid hex color (e.g. #f59e0b)',
  })
  secondaryColor?: string;

  @ApiPropertyOptional({
    description: 'Timezone for the organization',
    example: 'America/Caracas',
  })
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiPropertyOptional({
    description: 'Default currency for the organization',
    enum: Currency,
    example: Currency.USD,
  })
  @IsEnum(Currency)
  @IsOptional()
  defaultCurrency?: Currency;
}
