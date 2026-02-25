import { Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';

import { Organization } from '@domain/organization/entities/organization.entity';
import {
  OrganizationRepository,
  CreateOrganizationData,
} from '@domain/organization/repositories/organization.repository';
import { DrizzleService } from '../drizzle/drizzle.service';
import { organizations } from '../drizzle/schema/organization.schema';
import { OrganizationMapper } from '../drizzle/mappers/organization.mapper';

@Injectable()
export class DrizzleOrganizationRepository implements OrganizationRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(
    organizationData: CreateOrganizationData,
  ): Promise<Organization> {
    const [createdOrganization] = await this.drizzle.db
      .insert(organizations)
      .values({
        name: organizationData.name,
        slug: organizationData.slug,
        email: organizationData.email,
        phone: organizationData.phone || null,
        address: organizationData.address || null,
        logo: organizationData.logo || null,
        description: organizationData.description || null,
        website: organizationData.website || null,
        whatsapp: organizationData.whatsapp || null,
        instagram: organizationData.instagram || null,
        facebook: organizationData.facebook || null,
        primaryColor: organizationData.primaryColor || null,
        secondaryColor: organizationData.secondaryColor || null,
        timezone: organizationData.timezone || null,
        defaultCurrency: organizationData.defaultCurrency || null,
        isActive: organizationData.isActive,
        deleted: organizationData.deleted,
      })
      .returning();

    return OrganizationMapper.toDomain(createdOrganization);
  }

  async findById(id: string): Promise<Organization | null> {
    const [organization] = await this.drizzle.db
      .select()
      .from(organizations)
      .where(and(eq(organizations.id, id), eq(organizations.deleted, false)));

    return organization ? OrganizationMapper.toDomain(organization) : null;
  }

  async findByEmail(email: string): Promise<Organization | null> {
    const [organization] = await this.drizzle.db
      .select()
      .from(organizations)
      .where(
        and(eq(organizations.email, email), eq(organizations.deleted, false)),
      );

    return organization ? OrganizationMapper.toDomain(organization) : null;
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    const [organization] = await this.drizzle.db
      .select()
      .from(organizations)
      .where(
        and(eq(organizations.slug, slug), eq(organizations.deleted, false)),
      );

    return organization ? OrganizationMapper.toDomain(organization) : null;
  }

  async findAll(): Promise<Organization[]> {
    const organizationList = await this.drizzle.db
      .select()
      .from(organizations)
      .where(eq(organizations.deleted, false));

    return organizationList.map(OrganizationMapper.toDomain);
  }

  async update(
    id: string,
    organizationData: Partial<Organization>,
  ): Promise<Organization> {
    const updateData: any = {};

    if (organizationData.name !== undefined)
      updateData.name = organizationData.name;
    if (organizationData.slug !== undefined)
      updateData.slug = organizationData.slug;
    if (organizationData.email !== undefined)
      updateData.email = organizationData.email;
    if (organizationData.phone !== undefined)
      updateData.phone = organizationData.phone;
    if (organizationData.address !== undefined)
      updateData.address = organizationData.address;
    if (organizationData.logo !== undefined)
      updateData.logo = organizationData.logo;
    if (organizationData.description !== undefined)
      updateData.description = organizationData.description;
    if (organizationData.website !== undefined)
      updateData.website = organizationData.website;
    if (organizationData.whatsapp !== undefined)
      updateData.whatsapp = organizationData.whatsapp;
    if (organizationData.instagram !== undefined)
      updateData.instagram = organizationData.instagram;
    if (organizationData.facebook !== undefined)
      updateData.facebook = organizationData.facebook;
    if (organizationData.primaryColor !== undefined)
      updateData.primaryColor = organizationData.primaryColor;
    if (organizationData.secondaryColor !== undefined)
      updateData.secondaryColor = organizationData.secondaryColor;
    if (organizationData.timezone !== undefined)
      updateData.timezone = organizationData.timezone;
    if (organizationData.defaultCurrency !== undefined)
      updateData.defaultCurrency = organizationData.defaultCurrency;
    if (organizationData.isActive !== undefined)
      updateData.isActive = organizationData.isActive;

    const [updatedOrganization] = await this.drizzle.db
      .update(organizations)
      .set(updateData)
      .where(eq(organizations.id, id))
      .returning();

    return OrganizationMapper.toDomain(updatedOrganization);
  }

  async delete(id: string): Promise<void> {
    await this.drizzle.db
      .update(organizations)
      .set({ deleted: true })
      .where(eq(organizations.id, id));
  }
}
