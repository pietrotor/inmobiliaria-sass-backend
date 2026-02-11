import { Inject, Injectable } from '@nestjs/common';
import {
  PropertyRepository,
  PROPERTY_REPOSITORY,
} from '@domain/property/repositories/property.repository';
import { PropertyStatus } from '@domain/property/value-objects/property-status.vo';
import { CreatePropertyDto } from '../dto/create-property.dto';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class CreatePropertyUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
  ) {}

  async execute(
    createPropertyDto: CreatePropertyDto,
    organizationId: string,
  ) {
    try {
      // Generate slug from title
      const baseSlug = this.generateSlug(createPropertyDto.title);
      const slug = await this.ensureUniqueSlug(baseSlug);

      // Calculate price per sqm if total area is provided
      let pricePerSqm: number | undefined;
      if (createPropertyDto.totalArea && createPropertyDto.totalArea > 0) {
        pricePerSqm = Math.round(
          (createPropertyDto.price / createPropertyDto.totalArea) * 100,
        ) / 100;
      }

      const property = await this.propertyRepository.create({
        organizationId,
        title: createPropertyDto.title,
        slug,
        propertyType: createPropertyDto.propertyType,
        transactionType: createPropertyDto.transactionType,
        status: PropertyStatus.DRAFT,
        internalCode: createPropertyDto.internalCode,

        currency: createPropertyDto.currency,
        price: createPropertyDto.price,
        previousPrice: createPropertyDto.previousPrice,
        maintenanceFee: createPropertyDto.maintenanceFee,
        pricePerSqm,

        description: createPropertyDto.description,
        shortDescription: createPropertyDto.shortDescription,
        privateNotes: createPropertyDto.privateNotes,

        country: createPropertyDto.country,
        state: createPropertyDto.state,
        city: createPropertyDto.city,
        neighborhood: createPropertyDto.neighborhood,
        address: createPropertyDto.address,
        streetNumber: createPropertyDto.streetNumber,
        floor: createPropertyDto.floor,
        apartment: createPropertyDto.apartment,
        zipCode: createPropertyDto.zipCode,
        latitude: createPropertyDto.latitude,
        longitude: createPropertyDto.longitude,

        totalArea: createPropertyDto.totalArea,
        coveredArea: createPropertyDto.coveredArea,
        landArea: createPropertyDto.landArea,
        bedrooms: createPropertyDto.bedrooms,
        bathrooms: createPropertyDto.bathrooms,
        halfBathrooms: createPropertyDto.halfBathrooms,
        garages: createPropertyDto.garages,
        parkingSpaces: createPropertyDto.parkingSpaces,
        stories: createPropertyDto.stories,
        yearBuilt: createPropertyDto.yearBuilt,
        condition: createPropertyDto.condition,
        orientation: createPropertyDto.orientation,
        disposition: createPropertyDto.disposition,

        hasPool: createPropertyDto.hasPool,
        hasGarden: createPropertyDto.hasGarden,
        hasTerrace: createPropertyDto.hasTerrace,
        hasBalcony: createPropertyDto.hasBalcony,
        hasAirConditioning: createPropertyDto.hasAirConditioning,
        hasHeating: createPropertyDto.hasHeating,
        hasCentralHeating: createPropertyDto.hasCentralHeating,
        hasFireplace: createPropertyDto.hasFireplace,
        hasClosets: createPropertyDto.hasClosets,
        hasLaundryRoom: createPropertyDto.hasLaundryRoom,
        hasSecurity: createPropertyDto.hasSecurity,
        hasElevator: createPropertyDto.hasElevator,
        hasGym: createPropertyDto.hasGym,
        hasPetsAllowed: createPropertyDto.hasPetsAllowed,
        isFurnished: createPropertyDto.isFurnished,
        hasRooftop: createPropertyDto.hasRooftop,
        hasGrill: createPropertyDto.hasGrill,
        hasSolarPanels: createPropertyDto.hasSolarPanels,
        hasWaterTank: createPropertyDto.hasWaterTank,
        hasServiceRoom: createPropertyDto.hasServiceRoom,

        metaTitle: createPropertyDto.metaTitle,
        metaDescription: createPropertyDto.metaDescription,
        keywords: createPropertyDto.keywords,
        videoUrl: createPropertyDto.videoUrl,
        virtualTourUrl: createPropertyDto.virtualTourUrl,

        agentId: createPropertyDto.agentId,
        contactPhone: createPropertyDto.contactPhone,
        contactEmail: createPropertyDto.contactEmail,
        contactWhatsapp: createPropertyDto.contactWhatsapp,

        isFeatured: createPropertyDto.isFeatured || false,
        isPublished: false,
        viewCount: 0,
        deleted: false,
      });

      return property;
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'CreatePropertyUseCase');
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens
      .trim();
  }

  private async ensureUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let counter = 0;
    let existing = await this.propertyRepository.findBySlug(slug);

    while (existing) {
      counter++;
      slug = `${baseSlug}-${counter}`;
      existing = await this.propertyRepository.findBySlug(slug);
    }

    return slug;
  }
}
