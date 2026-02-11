import { Organization } from '../entities/organization.entity';

export const ORGANIZATION_REPOSITORY = 'ORGANIZATION_REPOSITORY';

export interface CreateOrganizationData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  deleted: boolean;
}

export interface OrganizationRepository {
  create(organization: CreateOrganizationData): Promise<Organization>;
  findById(id: string): Promise<Organization | null>;
  findByEmail(email: string): Promise<Organization | null>;
  findAll(): Promise<Organization[]>;
  update(id: string, organization: Partial<Organization>): Promise<Organization>;
  delete(id: string): Promise<void>;
}
