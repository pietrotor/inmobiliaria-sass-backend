import { Organization } from '../entities/organization.entity';

export const ORGANIZATION_REPOSITORY = 'ORGANIZATION_REPOSITORY';

export interface CreateOrganizationData {
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
}

export interface OrganizationRepository {
  create(organization: CreateOrganizationData): Promise<Organization>;
  findById(id: string): Promise<Organization | null>;
  findByEmail(email: string): Promise<Organization | null>;
  findBySlug(slug: string): Promise<Organization | null>;
  findAll(): Promise<Organization[]>;
  update(id: string, organization: Partial<Organization>): Promise<Organization>;
  delete(id: string): Promise<void>;
}
