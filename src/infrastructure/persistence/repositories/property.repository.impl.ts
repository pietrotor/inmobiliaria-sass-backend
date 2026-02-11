import { Injectable } from '@nestjs/common';
import {
  and,
  eq,
  gte,
  lte,
  ilike,
  or,
  sql,
  asc,
  desc,
  SQL,
} from 'drizzle-orm';

import { Property } from '@domain/property/entities/property.entity';
import {
  PropertyRepository,
  CreatePropertyData,
  FindAllPropertiesOptions,
  PaginatedProperties,
} from '@domain/property/repositories/property.repository';
import { DrizzleService } from '../drizzle/drizzle.service';
import { properties } from '../drizzle/schema/property.schema';
import { PropertyMapper } from '../drizzle/mappers/property.mapper';

@Injectable()
export class DrizzlePropertyRepository implements PropertyRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(propertyData: CreatePropertyData): Promise<Property> {
    const [created] = await this.drizzle.db
      .insert(properties)
      .values({
        organizationId: propertyData.organizationId,
        title: propertyData.title,
        slug: propertyData.slug,
        propertyType: propertyData.propertyType,
        transactionType: propertyData.transactionType,
        status: propertyData.status,
        internalCode: propertyData.internalCode || null,

        currency: propertyData.currency,
        price: String(propertyData.price),
        previousPrice: propertyData.previousPrice
          ? String(propertyData.previousPrice)
          : null,
        maintenanceFee: propertyData.maintenanceFee
          ? String(propertyData.maintenanceFee)
          : null,
        pricePerSqm: propertyData.pricePerSqm
          ? String(propertyData.pricePerSqm)
          : null,

        description: propertyData.description || null,
        shortDescription: propertyData.shortDescription || null,
        privateNotes: propertyData.privateNotes || null,

        country: propertyData.country || null,
        state: propertyData.state || null,
        city: propertyData.city || null,
        neighborhood: propertyData.neighborhood || null,
        address: propertyData.address || null,
        streetNumber: propertyData.streetNumber || null,
        floor: propertyData.floor || null,
        apartment: propertyData.apartment || null,
        zipCode: propertyData.zipCode || null,
        latitude: propertyData.latitude || null,
        longitude: propertyData.longitude || null,

        totalArea: propertyData.totalArea
          ? String(propertyData.totalArea)
          : null,
        coveredArea: propertyData.coveredArea
          ? String(propertyData.coveredArea)
          : null,
        landArea: propertyData.landArea
          ? String(propertyData.landArea)
          : null,
        bedrooms: propertyData.bedrooms || null,
        bathrooms: propertyData.bathrooms || null,
        halfBathrooms: propertyData.halfBathrooms || null,
        garages: propertyData.garages || null,
        parkingSpaces: propertyData.parkingSpaces || null,
        stories: propertyData.stories || null,
        yearBuilt: propertyData.yearBuilt || null,
        condition: propertyData.condition || null,
        orientation: propertyData.orientation || null,
        disposition: propertyData.disposition || null,

        hasPool: propertyData.hasPool || false,
        hasGarden: propertyData.hasGarden || false,
        hasTerrace: propertyData.hasTerrace || false,
        hasBalcony: propertyData.hasBalcony || false,
        hasAirConditioning: propertyData.hasAirConditioning || false,
        hasHeating: propertyData.hasHeating || false,
        hasCentralHeating: propertyData.hasCentralHeating || false,
        hasFireplace: propertyData.hasFireplace || false,
        hasClosets: propertyData.hasClosets || false,
        hasLaundryRoom: propertyData.hasLaundryRoom || false,
        hasSecurity: propertyData.hasSecurity || false,
        hasElevator: propertyData.hasElevator || false,
        hasGym: propertyData.hasGym || false,
        hasPetsAllowed: propertyData.hasPetsAllowed || false,
        isFurnished: propertyData.isFurnished || false,
        hasRooftop: propertyData.hasRooftop || false,
        hasGrill: propertyData.hasGrill || false,
        hasSolarPanels: propertyData.hasSolarPanels || false,
        hasWaterTank: propertyData.hasWaterTank || false,
        hasServiceRoom: propertyData.hasServiceRoom || false,

        metaTitle: propertyData.metaTitle || null,
        metaDescription: propertyData.metaDescription || null,
        keywords: propertyData.keywords || null,
        videoUrl: propertyData.videoUrl || null,
        virtualTourUrl: propertyData.virtualTourUrl || null,

        agentId: propertyData.agentId || null,
        contactPhone: propertyData.contactPhone || null,
        contactEmail: propertyData.contactEmail || null,
        contactWhatsapp: propertyData.contactWhatsapp || null,

        isFeatured: propertyData.isFeatured,
        isPublished: propertyData.isPublished,
        publishedAt: propertyData.publishedAt || null,
        expiresAt: propertyData.expiresAt || null,
        viewCount: propertyData.viewCount,

        deleted: propertyData.deleted,
      })
      .returning();

    return PropertyMapper.toDomain(created);
  }

  async findById(id: string): Promise<Property | null> {
    const [property] = await this.drizzle.db
      .select()
      .from(properties)
      .where(and(eq(properties.id, id), eq(properties.deleted, false)));

    return property ? PropertyMapper.toDomain(property) : null;
  }

  async findBySlug(slug: string): Promise<Property | null> {
    const [property] = await this.drizzle.db
      .select()
      .from(properties)
      .where(and(eq(properties.slug, slug), eq(properties.deleted, false)));

    return property ? PropertyMapper.toDomain(property) : null;
  }

  async findAll(
    options: FindAllPropertiesOptions,
  ): Promise<PaginatedProperties> {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const offset = (page - 1) * limit;

    // Build dynamic where conditions
    const conditions: SQL[] = [eq(properties.deleted, false)];

    if (options.organizationId) {
      conditions.push(eq(properties.organizationId, options.organizationId));
    }
    if (options.propertyType) {
      conditions.push(eq(properties.propertyType, options.propertyType as any));
    }
    if (options.transactionType) {
      conditions.push(
        eq(properties.transactionType, options.transactionType as any),
      );
    }
    if (options.status) {
      conditions.push(eq(properties.status, options.status as any));
    }
    if (options.currency) {
      conditions.push(eq(properties.currency, options.currency as any));
    }
    if (options.minPrice !== undefined) {
      conditions.push(
        gte(properties.price, String(options.minPrice)),
      );
    }
    if (options.maxPrice !== undefined) {
      conditions.push(
        lte(properties.price, String(options.maxPrice)),
      );
    }
    if (options.city) {
      conditions.push(ilike(properties.city, `%${options.city}%`));
    }
    if (options.state) {
      conditions.push(ilike(properties.state, `%${options.state}%`));
    }
    if (options.neighborhood) {
      conditions.push(
        ilike(properties.neighborhood, `%${options.neighborhood}%`),
      );
    }
    if (options.bedrooms !== undefined) {
      conditions.push(gte(properties.bedrooms, options.bedrooms));
    }
    if (options.bathrooms !== undefined) {
      conditions.push(gte(properties.bathrooms, options.bathrooms));
    }
    if (options.minTotalArea !== undefined) {
      conditions.push(
        gte(properties.totalArea, String(options.minTotalArea)),
      );
    }
    if (options.maxTotalArea !== undefined) {
      conditions.push(
        lte(properties.totalArea, String(options.maxTotalArea)),
      );
    }
    if (options.isFeatured !== undefined) {
      conditions.push(eq(properties.isFeatured, options.isFeatured));
    }
    if (options.isPublished !== undefined) {
      conditions.push(eq(properties.isPublished, options.isPublished));
    }
    if (options.search) {
      conditions.push(
        or(
          ilike(properties.title, `%${options.search}%`),
          ilike(properties.description, `%${options.search}%`),
          ilike(properties.address, `%${options.search}%`),
          ilike(properties.city, `%${options.search}%`),
          ilike(properties.neighborhood, `%${options.search}%`),
        ),
      );
    }

    const whereClause = and(...conditions);

    // Sort
    const sortColumn = this.getSortColumn(options.sortBy);
    const sortDirection =
      options.sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn);

    // Query data
    const data = await this.drizzle.db
      .select()
      .from(properties)
      .where(whereClause)
      .orderBy(sortDirection)
      .limit(limit)
      .offset(offset);

    // Query total count
    const [countResult] = await this.drizzle.db
      .select({ count: sql<number>`count(*)` })
      .from(properties)
      .where(whereClause);

    const total = Number(countResult.count);

    return {
      data: data.map(PropertyMapper.toDomain),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByOrganizationId(organizationId: string): Promise<Property[]> {
    const result = await this.drizzle.db
      .select()
      .from(properties)
      .where(
        and(
          eq(properties.organizationId, organizationId),
          eq(properties.deleted, false),
        ),
      );

    return result.map(PropertyMapper.toDomain);
  }

  async update(id: string, propertyData: Partial<Property>): Promise<Property> {
    const updateData: any = {};

    // Basic info
    if (propertyData.title !== undefined) updateData.title = propertyData.title;
    if (propertyData.slug !== undefined) updateData.slug = propertyData.slug;
    if (propertyData.propertyType !== undefined)
      updateData.propertyType = propertyData.propertyType;
    if (propertyData.transactionType !== undefined)
      updateData.transactionType = propertyData.transactionType;
    if (propertyData.status !== undefined)
      updateData.status = propertyData.status;
    if (propertyData.internalCode !== undefined)
      updateData.internalCode = propertyData.internalCode;

    // Pricing
    if (propertyData.currency !== undefined)
      updateData.currency = propertyData.currency;
    if (propertyData.price !== undefined)
      updateData.price = String(propertyData.price);
    if (propertyData.previousPrice !== undefined)
      updateData.previousPrice = propertyData.previousPrice
        ? String(propertyData.previousPrice)
        : null;
    if (propertyData.maintenanceFee !== undefined)
      updateData.maintenanceFee = propertyData.maintenanceFee
        ? String(propertyData.maintenanceFee)
        : null;
    if (propertyData.pricePerSqm !== undefined)
      updateData.pricePerSqm = propertyData.pricePerSqm
        ? String(propertyData.pricePerSqm)
        : null;

    // Descriptions
    if (propertyData.description !== undefined)
      updateData.description = propertyData.description;
    if (propertyData.shortDescription !== undefined)
      updateData.shortDescription = propertyData.shortDescription;
    if (propertyData.privateNotes !== undefined)
      updateData.privateNotes = propertyData.privateNotes;

    // Location
    if (propertyData.country !== undefined)
      updateData.country = propertyData.country;
    if (propertyData.state !== undefined) updateData.state = propertyData.state;
    if (propertyData.city !== undefined) updateData.city = propertyData.city;
    if (propertyData.neighborhood !== undefined)
      updateData.neighborhood = propertyData.neighborhood;
    if (propertyData.address !== undefined)
      updateData.address = propertyData.address;
    if (propertyData.streetNumber !== undefined)
      updateData.streetNumber = propertyData.streetNumber;
    if (propertyData.floor !== undefined) updateData.floor = propertyData.floor;
    if (propertyData.apartment !== undefined)
      updateData.apartment = propertyData.apartment;
    if (propertyData.zipCode !== undefined)
      updateData.zipCode = propertyData.zipCode;
    if (propertyData.latitude !== undefined)
      updateData.latitude = propertyData.latitude;
    if (propertyData.longitude !== undefined)
      updateData.longitude = propertyData.longitude;

    // Physical characteristics
    if (propertyData.totalArea !== undefined)
      updateData.totalArea = propertyData.totalArea
        ? String(propertyData.totalArea)
        : null;
    if (propertyData.coveredArea !== undefined)
      updateData.coveredArea = propertyData.coveredArea
        ? String(propertyData.coveredArea)
        : null;
    if (propertyData.landArea !== undefined)
      updateData.landArea = propertyData.landArea
        ? String(propertyData.landArea)
        : null;
    if (propertyData.bedrooms !== undefined)
      updateData.bedrooms = propertyData.bedrooms;
    if (propertyData.bathrooms !== undefined)
      updateData.bathrooms = propertyData.bathrooms;
    if (propertyData.halfBathrooms !== undefined)
      updateData.halfBathrooms = propertyData.halfBathrooms;
    if (propertyData.garages !== undefined)
      updateData.garages = propertyData.garages;
    if (propertyData.parkingSpaces !== undefined)
      updateData.parkingSpaces = propertyData.parkingSpaces;
    if (propertyData.stories !== undefined)
      updateData.stories = propertyData.stories;
    if (propertyData.yearBuilt !== undefined)
      updateData.yearBuilt = propertyData.yearBuilt;
    if (propertyData.condition !== undefined)
      updateData.condition = propertyData.condition;
    if (propertyData.orientation !== undefined)
      updateData.orientation = propertyData.orientation;
    if (propertyData.disposition !== undefined)
      updateData.disposition = propertyData.disposition;

    // Amenities
    if (propertyData.hasPool !== undefined)
      updateData.hasPool = propertyData.hasPool;
    if (propertyData.hasGarden !== undefined)
      updateData.hasGarden = propertyData.hasGarden;
    if (propertyData.hasTerrace !== undefined)
      updateData.hasTerrace = propertyData.hasTerrace;
    if (propertyData.hasBalcony !== undefined)
      updateData.hasBalcony = propertyData.hasBalcony;
    if (propertyData.hasAirConditioning !== undefined)
      updateData.hasAirConditioning = propertyData.hasAirConditioning;
    if (propertyData.hasHeating !== undefined)
      updateData.hasHeating = propertyData.hasHeating;
    if (propertyData.hasCentralHeating !== undefined)
      updateData.hasCentralHeating = propertyData.hasCentralHeating;
    if (propertyData.hasFireplace !== undefined)
      updateData.hasFireplace = propertyData.hasFireplace;
    if (propertyData.hasClosets !== undefined)
      updateData.hasClosets = propertyData.hasClosets;
    if (propertyData.hasLaundryRoom !== undefined)
      updateData.hasLaundryRoom = propertyData.hasLaundryRoom;
    if (propertyData.hasSecurity !== undefined)
      updateData.hasSecurity = propertyData.hasSecurity;
    if (propertyData.hasElevator !== undefined)
      updateData.hasElevator = propertyData.hasElevator;
    if (propertyData.hasGym !== undefined)
      updateData.hasGym = propertyData.hasGym;
    if (propertyData.hasPetsAllowed !== undefined)
      updateData.hasPetsAllowed = propertyData.hasPetsAllowed;
    if (propertyData.isFurnished !== undefined)
      updateData.isFurnished = propertyData.isFurnished;
    if (propertyData.hasRooftop !== undefined)
      updateData.hasRooftop = propertyData.hasRooftop;
    if (propertyData.hasGrill !== undefined)
      updateData.hasGrill = propertyData.hasGrill;
    if (propertyData.hasSolarPanels !== undefined)
      updateData.hasSolarPanels = propertyData.hasSolarPanels;
    if (propertyData.hasWaterTank !== undefined)
      updateData.hasWaterTank = propertyData.hasWaterTank;
    if (propertyData.hasServiceRoom !== undefined)
      updateData.hasServiceRoom = propertyData.hasServiceRoom;

    // SEO
    if (propertyData.metaTitle !== undefined)
      updateData.metaTitle = propertyData.metaTitle;
    if (propertyData.metaDescription !== undefined)
      updateData.metaDescription = propertyData.metaDescription;
    if (propertyData.keywords !== undefined)
      updateData.keywords = propertyData.keywords;
    if (propertyData.videoUrl !== undefined)
      updateData.videoUrl = propertyData.videoUrl;
    if (propertyData.virtualTourUrl !== undefined)
      updateData.virtualTourUrl = propertyData.virtualTourUrl;

    // Contact
    if (propertyData.agentId !== undefined)
      updateData.agentId = propertyData.agentId;
    if (propertyData.contactPhone !== undefined)
      updateData.contactPhone = propertyData.contactPhone;
    if (propertyData.contactEmail !== undefined)
      updateData.contactEmail = propertyData.contactEmail;
    if (propertyData.contactWhatsapp !== undefined)
      updateData.contactWhatsapp = propertyData.contactWhatsapp;

    // Control
    if (propertyData.isFeatured !== undefined)
      updateData.isFeatured = propertyData.isFeatured;
    if (propertyData.isPublished !== undefined)
      updateData.isPublished = propertyData.isPublished;
    if (propertyData.publishedAt !== undefined)
      updateData.publishedAt = propertyData.publishedAt;
    if (propertyData.expiresAt !== undefined)
      updateData.expiresAt = propertyData.expiresAt;
    if (propertyData.viewCount !== undefined)
      updateData.viewCount = propertyData.viewCount;
    if (propertyData.deleted !== undefined)
      updateData.deleted = propertyData.deleted;

    const [updated] = await this.drizzle.db
      .update(properties)
      .set(updateData)
      .where(eq(properties.id, id))
      .returning();

    return PropertyMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.drizzle.db
      .update(properties)
      .set({ deleted: true })
      .where(eq(properties.id, id));
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.drizzle.db
      .update(properties)
      .set({ viewCount: sql`${properties.viewCount} + 1` })
      .where(eq(properties.id, id));
  }

  private getSortColumn(sortBy?: string) {
    switch (sortBy) {
      case 'price':
        return properties.price;
      case 'title':
        return properties.title;
      case 'bedrooms':
        return properties.bedrooms;
      case 'totalArea':
        return properties.totalArea;
      case 'viewCount':
        return properties.viewCount;
      case 'publishedAt':
        return properties.publishedAt;
      default:
        return properties.createdAt;
    }
  }
}
