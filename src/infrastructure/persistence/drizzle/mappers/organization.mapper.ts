import { Organization } from '@domain/organization/entities/organization.entity';
import { OrganizationSchema } from '../schema/organization.schema';

export class OrganizationMapper {
  static toDomain(schema: OrganizationSchema): Organization {
    return new Organization({
      id: schema.id,
      name: schema.name,
      slug: schema.slug,
      email: schema.email,
      phone: schema.phone || undefined,
      address: schema.address || undefined,
      logo: schema.logo || undefined,
      description: schema.description || undefined,
      website: schema.website || undefined,
      whatsapp: schema.whatsapp || undefined,
      instagram: schema.instagram || undefined,
      facebook: schema.facebook || undefined,
      primaryColor: schema.primaryColor || undefined,
      secondaryColor: schema.secondaryColor || undefined,
      timezone: schema.timezone || undefined,
      defaultCurrency: schema.defaultCurrency || undefined,
      isActive: schema.isActive,
      deleted: schema.deleted,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  static toPersistence(
    organization: Omit<Organization, 'id'>,
  ): Omit<OrganizationSchema, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      name: organization.name,
      slug: organization.slug,
      email: organization.email,
      phone: organization.phone || null,
      address: organization.address || null,
      logo: organization.logo || null,
      description: organization.description || null,
      website: organization.website || null,
      whatsapp: organization.whatsapp || null,
      instagram: organization.instagram || null,
      facebook: organization.facebook || null,
      primaryColor: organization.primaryColor || null,
      secondaryColor: organization.secondaryColor || null,
      timezone: organization.timezone || null,
      defaultCurrency: organization.defaultCurrency || null,
      isActive: organization.isActive,
      deleted: organization.deleted,
    };
  }
}
