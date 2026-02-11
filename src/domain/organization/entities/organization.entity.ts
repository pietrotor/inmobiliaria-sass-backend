export interface OrganizationProps {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  deleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Organization {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly phone?: string;
  public readonly address?: string;
  public readonly isActive: boolean;
  public readonly deleted: boolean;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(props: OrganizationProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.phone = props.phone;
    this.address = props.address;
    this.isActive = props.isActive;
    this.deleted = props.deleted;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  // Business logic methods
  activate(): Organization {
    return new Organization({
      ...this,
      isActive: true,
    });
  }

  deactivate(): Organization {
    return new Organization({
      ...this,
      isActive: false,
    });
  }

  softDelete(): Organization {
    return new Organization({
      ...this,
      deleted: true,
    });
  }

  updateInfo(data: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  }): Organization {
    return new Organization({
      ...this,
      ...data,
    });
  }
}
