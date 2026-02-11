import { SetMetadata } from '@nestjs/common';
import { Role } from '@domain/user/value-objects/role.vo';

export const META_ROLES = 'roles';

export const RoleProtected = (...args: Role[]) => {
  return SetMetadata(META_ROLES, args);
};
