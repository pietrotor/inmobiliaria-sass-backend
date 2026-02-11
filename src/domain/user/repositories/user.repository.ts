import { User } from '../entities/user.entity';
import { Role } from '../value-objects/role.vo';

export interface CreateUserData {
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  organizationId: string;
  password: string;
  roles: Role[];
  isActive: boolean;
  deleted?: boolean;
}

export interface UserRepository {
  create(user: CreateUserData): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: string, user: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
  deleteAll(): Promise<void>;
}

// Token for dependency injection
export const USER_REPOSITORY = 'UserRepository';
