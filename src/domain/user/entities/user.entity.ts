import { Role } from '../value-objects/role.vo';

export interface UserProps {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  roles: Role[];
  organizationId: string;
  isActive: boolean;
  deleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  public readonly id: string;
  public readonly name: string;
  public readonly lastName: string;
  public readonly email: string;
  public readonly phoneNumber: string;
  public readonly password: string;
  public readonly roles: Role[];
  public readonly organizationId: string;
  public readonly isActive: boolean;
  public readonly deleted: boolean;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.name = props.name;
    this.lastName = props.lastName;
    this.email = props.email;
    this.phoneNumber = props.phoneNumber;
    this.password = props.password;
    this.roles = props.roles;
    this.organizationId = props.organizationId;
    this.isActive = props.isActive;
    this.deleted = props.deleted;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  // Business logic methods
  hasRole(role: Role): boolean {
    return this.roles.includes(role);
  }

  isAdmin(): boolean {
    return this.hasRole(Role.ADMIN);
  }

  isSuperUser(): boolean {
    return this.hasRole(Role.SUPER_USER);
  }

  activate(): User {
    return new User({
      id: this.id,
      name: this.name,
      lastName: this.lastName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      password: this.password,
      roles: this.roles,
      organizationId: this.organizationId,
      isActive: true,
      deleted: this.deleted,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }

  deactivate(): User {
    return new User({
      id: this.id,
      name: this.name,
      lastName: this.lastName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      password: this.password,
      roles: this.roles,
      organizationId: this.organizationId,
      isActive: false,
      deleted: this.deleted,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }

  withoutPassword() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}
