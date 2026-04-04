import { User } from '@domain/user/entities/user.entity';
import { UserRole } from '@domain/user/value-objects/role.vo';
import { UserSchema } from '../schema/user.schema';

export class UserMapper {
  static toDomain(schema: UserSchema): User {
    return new User({
      id: schema.id,
      name: schema.name,
      lastName: schema.lastName,
      email: schema.email,
      phoneNumber: schema.phoneNumber,
      password: schema.password,
      role: schema.role as UserRole,
      organizationId: schema.organizationId,
      isActive: schema.isActive,
      deleted: schema.deleted,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  static toPersistence(
    domain: User,
  ): Omit<UserSchema, 'createdAt' | 'updatedAt'> {
    return {
      id: domain.id,
      name: domain.name,
      lastName: domain.lastName,
      email: domain.email,
      phoneNumber: domain.phoneNumber,
      password: domain.password,
      role: domain.role as any,
      organizationId: domain.organizationId,
      isActive: domain.isActive,
      deleted: domain.deleted,
    };
  }
}
