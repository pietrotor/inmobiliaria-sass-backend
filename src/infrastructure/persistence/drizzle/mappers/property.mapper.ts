import { Property } from '@domain/property/entities/property.entity';
import { PropertyType } from '@domain/property/value-objects/property-type.vo';
import { TransactionType } from '@domain/property/value-objects/transaction-type.vo';
import { PropertyStatus } from '@domain/property/value-objects/property-status.vo';
import { Currency } from '@domain/property/value-objects/currency.vo';
import { PropertyCondition } from '@domain/property/value-objects/property-condition.vo';
import { PropertySchema } from '../schema/property.schema';

export class PropertyMapper {
  static toDomain(schema: PropertySchema): Property {
    return new Property({
      id: schema.id,
      organizationId: schema.organizationId,

      // Basic info
      title: schema.title,
      slug: schema.slug,
      propertyType: schema.propertyType as PropertyType,
      transactionType: schema.transactionType as TransactionType,
      status: schema.status as PropertyStatus,
      internalCode: schema.internalCode || undefined,

      // Main price
      currency: schema.currency as Currency,
      price: Number(schema.price),
      previousPrice: schema.previousPrice
        ? Number(schema.previousPrice)
        : undefined,
      maintenanceFee: schema.maintenanceFee
        ? Number(schema.maintenanceFee)
        : undefined,
      pricePerSqm: schema.pricePerSqm
        ? Number(schema.pricePerSqm)
        : undefined,

      // Descriptions
      description: schema.description || undefined,
      shortDescription: schema.shortDescription || undefined,
      privateNotes: schema.privateNotes || undefined,

      // Location (FK references)
      countryId: schema.countryId || undefined,
      cityId: schema.cityId || undefined,
      neighborhoodId: schema.neighborhoodId || undefined,
      address: schema.address || undefined,
      streetNumber: schema.streetNumber || undefined,
      floor: schema.floor || undefined,
      apartment: schema.apartment || undefined,
      zipCode: schema.zipCode || undefined,
      latitude: schema.latitude || undefined,
      longitude: schema.longitude || undefined,

      // Physical characteristics
      totalArea: schema.totalArea ? Number(schema.totalArea) : undefined,
      coveredArea: schema.coveredArea ? Number(schema.coveredArea) : undefined,
      landArea: schema.landArea ? Number(schema.landArea) : undefined,
      bedrooms: schema.bedrooms || undefined,
      bathrooms: schema.bathrooms || undefined,
      halfBathrooms: schema.halfBathrooms || undefined,
      garages: schema.garages || undefined,
      parkingSpaces: schema.parkingSpaces || undefined,
      stories: schema.stories || undefined,
      yearBuilt: schema.yearBuilt || undefined,
      condition: schema.condition
        ? (schema.condition as PropertyCondition)
        : undefined,
      orientation: schema.orientation || undefined,
      disposition: schema.disposition || undefined,

      // Amenities
      hasPool: schema.hasPool || undefined,
      hasGarden: schema.hasGarden || undefined,
      hasTerrace: schema.hasTerrace || undefined,
      hasBalcony: schema.hasBalcony || undefined,
      hasAirConditioning: schema.hasAirConditioning || undefined,
      hasHeating: schema.hasHeating || undefined,
      hasCentralHeating: schema.hasCentralHeating || undefined,
      hasFireplace: schema.hasFireplace || undefined,
      hasClosets: schema.hasClosets || undefined,
      hasLaundryRoom: schema.hasLaundryRoom || undefined,
      hasSecurity: schema.hasSecurity || undefined,
      hasElevator: schema.hasElevator || undefined,
      hasGym: schema.hasGym || undefined,
      hasPetsAllowed: schema.hasPetsAllowed || undefined,
      isFurnished: schema.isFurnished || undefined,
      hasRooftop: schema.hasRooftop || undefined,
      hasGrill: schema.hasGrill || undefined,
      hasSolarPanels: schema.hasSolarPanels || undefined,
      hasWaterTank: schema.hasWaterTank || undefined,
      hasServiceRoom: schema.hasServiceRoom || undefined,

      // SEO & web
      metaTitle: schema.metaTitle || undefined,
      metaDescription: schema.metaDescription || undefined,
      keywords: schema.keywords || undefined,
      videoUrl: schema.videoUrl || undefined,
      virtualTourUrl: schema.virtualTourUrl || undefined,

      // Contact / agent
      agentId: schema.agentId || undefined,
      contactPhone: schema.contactPhone || undefined,
      contactEmail: schema.contactEmail || undefined,
      contactWhatsapp: schema.contactWhatsapp || undefined,

      // Control
      isFeatured: schema.isFeatured,
      isPublished: schema.isPublished,
      publishedAt: schema.publishedAt || undefined,
      expiresAt: schema.expiresAt || undefined,
      viewCount: schema.viewCount,

      // Audit
      deleted: schema.deleted,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  static toPersistence(
    domain: Property,
  ): Omit<PropertySchema, 'createdAt' | 'updatedAt'> {
    return {
      id: domain.id,
      organizationId: domain.organizationId,

      title: domain.title,
      slug: domain.slug,
      propertyType: domain.propertyType,
      transactionType: domain.transactionType,
      status: domain.status,
      internalCode: domain.internalCode || null,

      currency: domain.currency,
      price: String(domain.price),
      previousPrice: domain.previousPrice
        ? String(domain.previousPrice)
        : null,
      maintenanceFee: domain.maintenanceFee
        ? String(domain.maintenanceFee)
        : null,
      pricePerSqm: domain.pricePerSqm ? String(domain.pricePerSqm) : null,

      description: domain.description || null,
      shortDescription: domain.shortDescription || null,
      privateNotes: domain.privateNotes || null,

      countryId: domain.countryId || null,
      cityId: domain.cityId || null,
      neighborhoodId: domain.neighborhoodId || null,
      address: domain.address || null,
      streetNumber: domain.streetNumber || null,
      floor: domain.floor || null,
      apartment: domain.apartment || null,
      zipCode: domain.zipCode || null,
      latitude: domain.latitude || null,
      longitude: domain.longitude || null,

      totalArea: domain.totalArea ? String(domain.totalArea) : null,
      coveredArea: domain.coveredArea ? String(domain.coveredArea) : null,
      landArea: domain.landArea ? String(domain.landArea) : null,
      bedrooms: domain.bedrooms || null,
      bathrooms: domain.bathrooms || null,
      halfBathrooms: domain.halfBathrooms || null,
      garages: domain.garages || null,
      parkingSpaces: domain.parkingSpaces || null,
      stories: domain.stories || null,
      yearBuilt: domain.yearBuilt || null,
      condition: domain.condition || null,
      orientation: domain.orientation || null,
      disposition: domain.disposition || null,

      hasPool: domain.hasPool || false,
      hasGarden: domain.hasGarden || false,
      hasTerrace: domain.hasTerrace || false,
      hasBalcony: domain.hasBalcony || false,
      hasAirConditioning: domain.hasAirConditioning || false,
      hasHeating: domain.hasHeating || false,
      hasCentralHeating: domain.hasCentralHeating || false,
      hasFireplace: domain.hasFireplace || false,
      hasClosets: domain.hasClosets || false,
      hasLaundryRoom: domain.hasLaundryRoom || false,
      hasSecurity: domain.hasSecurity || false,
      hasElevator: domain.hasElevator || false,
      hasGym: domain.hasGym || false,
      hasPetsAllowed: domain.hasPetsAllowed || false,
      isFurnished: domain.isFurnished || false,
      hasRooftop: domain.hasRooftop || false,
      hasGrill: domain.hasGrill || false,
      hasSolarPanels: domain.hasSolarPanels || false,
      hasWaterTank: domain.hasWaterTank || false,
      hasServiceRoom: domain.hasServiceRoom || false,

      metaTitle: domain.metaTitle || null,
      metaDescription: domain.metaDescription || null,
      keywords: domain.keywords || null,
      videoUrl: domain.videoUrl || null,
      virtualTourUrl: domain.virtualTourUrl || null,

      agentId: domain.agentId || null,
      contactPhone: domain.contactPhone || null,
      contactEmail: domain.contactEmail || null,
      contactWhatsapp: domain.contactWhatsapp || null,

      isFeatured: domain.isFeatured,
      isPublished: domain.isPublished,
      publishedAt: domain.publishedAt || null,
      expiresAt: domain.expiresAt || null,
      viewCount: domain.viewCount,

      deleted: domain.deleted,
    };
  }
}
