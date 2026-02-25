import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import {
  PropertyRepository,
  PROPERTY_REPOSITORY,
} from '@domain/property/repositories/property.repository';
import {
  PropertyPriceRepository,
  PROPERTY_PRICE_REPOSITORY,
} from '@domain/property/repositories/property-price.repository';
import { UpdatePropertyDto } from '../dto/update-property.dto';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class UpdatePropertyUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(PROPERTY_PRICE_REPOSITORY)
    private readonly propertyPriceRepository: PropertyPriceRepository,
  ) {}

  async execute(
    id: string,
    updatePropertyDto: UpdatePropertyDto,
    organizationId: string,
  ) {
    try {
      const property = await this.propertyRepository.findById(id);

      if (!property) {
        throw new NotFoundException(
          `Property with identifier '${id}' not found`,
        );
      }

      if (property.organizationId !== organizationId) {
        throw new ForbiddenException(
          'You do not have permission to update this property',
        );
      }

      // If title changed, regenerate slug
      let slug = property.slug;
      if (
        updatePropertyDto.title &&
        updatePropertyDto.title !== property.title
      ) {
        const baseSlug = this.generateSlug(updatePropertyDto.title);
        slug = await this.ensureUniqueSlug(baseSlug, id);
      }

      // Handle prices update if provided
      let mainPrice = property.price;
      let mainCurrency = property.currency;

      if (updatePropertyDto.prices && updatePropertyDto.prices.length > 0) {
        // Delete old prices and insert new ones
        await this.propertyPriceRepository.deleteByPropertyId(id);

        const mainPriceDto =
          updatePropertyDto.prices.find((p) => p.isMain) ||
          updatePropertyDto.prices[0];

        mainPrice = mainPriceDto.price;
        mainCurrency = mainPriceDto.currency;

        await Promise.all(
          updatePropertyDto.prices.map((priceDto) =>
            this.propertyPriceRepository.create({
              propertyId: id,
              currency: priceDto.currency,
              price: priceDto.price,
              isMain: priceDto.currency === mainPriceDto.currency,
            }),
          ),
        );
      }

      // Recalculate pricePerSqm if price or area changed
      const totalArea = updatePropertyDto.totalArea ?? property.totalArea;
      let pricePerSqm = property.pricePerSqm;
      if (totalArea && totalArea > 0) {
        pricePerSqm = Math.round((mainPrice / totalArea) * 100) / 100;
      }

      // Build update data excluding prices (handled separately)
      const { prices, ...propertyFields } = updatePropertyDto;

      const updatedProperty = await this.propertyRepository.update(id, {
        ...propertyFields,
        slug,
        price: mainPrice,
        currency: mainCurrency,
        pricePerSqm,
      } as any);

      return updatedProperty;
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'UpdatePropertyUseCase');
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private async ensureUniqueSlug(
    baseSlug: string,
    excludeId: string,
  ): Promise<string> {
    let slug = baseSlug;
    let counter = 0;
    let existing = await this.propertyRepository.findBySlug(slug);

    while (existing && existing.id !== excludeId) {
      counter++;
      slug = `${baseSlug}-${counter}`;
      existing = await this.propertyRepository.findBySlug(slug);
    }

    return slug;
  }
}
