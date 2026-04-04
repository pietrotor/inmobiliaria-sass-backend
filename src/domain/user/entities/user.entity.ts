import { UserRole } from '../value-objects/role.vo';

export interface UserProps {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: UserRole;
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
  public readonly role: UserRole;
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
    this.role = props.role;
    this.organizationId = props.organizationId;
    this.isActive = props.isActive;
    this.deleted = props.deleted;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  hasRole(role: UserRole): boolean {
    return this.role === role;
  }

  isAdmin(): boolean {
    return this.role === UserRole.DEVELOPER_ADMIN;
  }

  isSuperAdmin(): boolean {
    return this.role === UserRole.SUPER_ADMIN;
  }

  isDeveloper(): boolean {
    return (
      this.role === UserRole.DEVELOPER_ADMIN ||
      this.role === UserRole.DEVELOPER_SALES
    );
  }

  isBroker(): boolean {
    return this.role === UserRole.BROKER;
  }

  activate(): User {
    return new User({ ...this, isActive: true });
  }

  deactivate(): User {
    return new User({ ...this, isActive: false });
  }

  withoutPassword() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}
