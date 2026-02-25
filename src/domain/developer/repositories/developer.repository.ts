import { Developer } from '../entities/developer.entity';

export const DEVELOPER_REPOSITORY = 'DEVELOPER_REPOSITORY';

export interface CreateDeveloperData {
  organizationId: string;
  name: string;
  legalName: string;
  taxId: string;
  phone: string;
  email: string;
}

export interface DeveloperRepository {
  create(data: CreateDeveloperData): Promise<Developer>;
  findById(id: string): Promise<Developer | null>;
  findByOrganizationId(organizationId: string): Promise<Developer | null>;
  findAll(): Promise<Developer[]>;
  update(id: string, data: Partial<Developer>): Promise<Developer>;
  delete(id: string): Promise<void>;
}
