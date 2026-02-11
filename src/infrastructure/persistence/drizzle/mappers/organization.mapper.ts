import { Organization } from '@domain/organization/entities/organization.entity';
import { OrganizationSchema } from '../schema/organization.schema';

export class OrganizationMapper {
  static toDomain(schema: OrganizationSchema): Organization {
    return new Organization({
      id: schema.id,
      name: schema.name,
      email: schema.email,
      phone: schema.phone || undefined,
      address: schema.address || undefined,
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
      email: organization.email,
      phone: organization.phone || null,
      address: organization.address || null,
      isActive: organization.isActive,
      deleted: organization.deleted,
    };
  }
}
