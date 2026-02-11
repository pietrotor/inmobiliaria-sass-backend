import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  PropertyRepository,
  PROPERTY_REPOSITORY,
} from '@domain/property/repositories/property.repository';
import { UpdatePropertyDto } from '../dto/update-property.dto';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class UpdatePropertyUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
  ) {}

  async execute(id: string, updatePropertyDto: UpdatePropertyDto) {
    try {
      const property = await this.propertyRepository.findById(id);

      if (!property) {
        throw new NotFoundException(
          `Property with identifier '${id}' not found`,
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

      // Recalculate pricePerSqm if price or area changed
      const price = updatePropertyDto.price ?? property.price;
      const totalArea = updatePropertyDto.totalArea ?? property.totalArea;
      let pricePerSqm = property.pricePerSqm;
      if (totalArea && totalArea > 0) {
        pricePerSqm = Math.round((price / totalArea) * 100) / 100;
      }

      const updatedProperty = await this.propertyRepository.update(id, {
        ...updatePropertyDto,
        slug,
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
