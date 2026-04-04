import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@domain/user/value-objects/role.vo';

export const META_ROLES = 'roles';

export const RoleProtected = (...args: UserRole[]) => {
  return SetMetadata(META_ROLES, args);
};
