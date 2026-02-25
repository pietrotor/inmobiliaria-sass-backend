export interface OrganizationProps {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone?: string;
  address?: string;
  logo?: string;
  description?: string;
  website?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  primaryColor?: string;
  secondaryColor?: string;
  timezone?: string;
  defaultCurrency?: string;
  isActive: boolean;
  deleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Organization {
  public readonly id: string;
  public readonly name: string;
  public readonly slug: string;
  public readonly email: string;
  public readonly phone?: string;
  public readonly address?: string;
  public readonly logo?: string;
  public readonly description?: string;
  public readonly website?: string;
  public readonly whatsapp?: string;
  public readonly instagram?: string;
  public readonly facebook?: string;
  public readonly primaryColor?: string;
  public readonly secondaryColor?: string;
  public readonly timezone?: string;
  public readonly defaultCurrency?: string;
  public readonly isActive: boolean;
  public readonly deleted: boolean;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(props: OrganizationProps) {
    this.id = props.id;
    this.name = props.name;
    this.slug = props.slug;
    this.email = props.email;
    this.phone = props.phone;
    this.address = props.address;
    this.logo = props.logo;
    this.description = props.description;
    this.website = props.website;
    this.whatsapp = props.whatsapp;
    this.instagram = props.instagram;
    this.facebook = props.facebook;
    this.primaryColor = props.primaryColor;
    this.secondaryColor = props.secondaryColor;
    this.timezone = props.timezone;
    this.defaultCurrency = props.defaultCurrency;
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

  updateInfo(data: Partial<Omit<OrganizationProps, 'id' | 'createdAt' | 'updatedAt'>>): Organization {
    return new Organization({
      ...this,
      ...data,
    });
  }

  /** Generate a slug from the organization name */
  static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
