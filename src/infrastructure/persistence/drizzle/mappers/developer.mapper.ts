import { Developer } from '@domain/developer/entities/developer.entity';
import { DeveloperSchema } from '../schema/developer.schema';

export class DeveloperMapper {
  static toDomain(schema: DeveloperSchema): Developer {
    return new Developer({
      id: schema.id,
      organizationId: schema.organizationId,
      name: schema.name,
      legalName: schema.legalName,
      taxId: schema.taxId,
      phone: schema.phone,
      email: schema.email,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  static toPersistence(
    developer: Omit<Developer, 'id' | 'createdAt' | 'updatedAt'>,
  ): Omit<DeveloperSchema, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      organizationId: developer.organizationId,
      name: developer.name,
      legalName: developer.legalName,
      taxId: developer.taxId,
      phone: developer.phone,
      email: developer.email,
    };
  }
}
