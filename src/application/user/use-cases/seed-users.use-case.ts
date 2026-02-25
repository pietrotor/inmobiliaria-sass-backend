import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import {
  UserRepository,
  USER_REPOSITORY,
} from '@domain/user/repositories/user.repository';
import {
  OrganizationRepository,
  ORGANIZATION_REPOSITORY,
} from '@domain/organization/repositories/organization.repository';
import { Organization } from '@domain/organization/entities/organization.entity';
import { Role } from '@domain/user/value-objects/role.vo';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

interface SeedOrganization {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

interface SeedUser {
  name: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  roles: Role[];
}

const initialOrganizations: SeedOrganization[] = [
  {
    name: 'Trackio Organization',
    email: 'contact@trackio.com',
    phone: '+1234567890',
    address: '123 Main St, New York, USA',
  },
];

const initialUsers: SeedUser[] = [
  {
    name: 'Pietro',
    lastName: 'Torrico Escobar',
    phoneNumber: '69531998',
    email: 'torricopietro@gmail.com',
    password: bcrypt.hashSync('Pietrogato3@', 10),
    roles: [Role.ADMIN],
  },
  {
    name: 'Jose',
    lastName: 'Gomez Perez',
    phoneNumber: '78451233',
    email: 'test@test.com',
    password: bcrypt.hashSync('Abc123', 10),
    roles: [Role.USER],
  },
  {
    name: 'Maria',
    lastName: 'Rodriguez',
    phoneNumber: '70123456',
    email: 'maria@example.com',
    password: bcrypt.hashSync('Password123', 10),
    roles: [Role.USER],
  },
];

@Injectable()
export class SeedUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async execute() {
    try {
      console.log('[SeedUsersUseCase] Starting seed process...');

      // Delete all existing data (HARD DELETE)
      await this.deleteAllData();

      // Create organizations first
      const createdOrganizations = await this.createOrganizations();
      const defaultOrganizationId = createdOrganizations[0].id;

      // Create seed users
      const createdUsers = await this.createUsers(defaultOrganizationId);

      console.log('[SeedUsersUseCase] Seed process completed successfully!');

      return {
        message: 'Database seeded successfully',
        organization: {
          id: createdOrganizations[0].id,
          name: createdOrganizations[0].name,
          email: createdOrganizations[0].email,
        },
        users: createdUsers.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          roles: u.roles,
        })),
      };
    } catch (error) {
      console.error('[SeedUsersUseCase] Error during seed:', error);
      DatabaseErrorHandler.handle(error, 'SeedUsersUseCase');
    }
  }

  private async deleteAllData() {
    console.log('[SeedUsersUseCase] 🗑️  Deleting ALL data (hard delete)...');

    // Retrieve organizations once to reuse through deletion process
    const organizations = await this.organizationRepository.findAll();

    // Delete users (depends on organization)
    console.log('[SeedUsersUseCase] Deleting all users...');
    await this.userRepository.deleteAll();
    console.log('[SeedUsersUseCase] ✅ Deleted all users');

    // Finally delete organizations (no dependencies)
    console.log('[SeedUsersUseCase] Deleting all organizations...');
    for (const org of organizations) {
      await this.organizationRepository.delete(org.id);
    }
    console.log(
      `[SeedUsersUseCase] ✅ Deleted ${organizations.length} organizations`,
    );
  }

  private async createOrganizations() {
    console.log(
      `[SeedUsersUseCase] Creating ${initialOrganizations.length} organizations...`,
    );
    const organizations = [];

    for (const orgData of initialOrganizations) {
      const organization = await this.organizationRepository.create({
        ...orgData,
        slug: Organization.generateSlug(orgData.name),
        isActive: true,
        deleted: false,
      });
      organizations.push(organization);
      console.log(
        `[SeedUsersUseCase] ✅ Created organization: ${organization.name}`,
      );
    }

    return organizations;
  }

  private async createUsers(organizationId: string) {
    console.log(`[SeedUsersUseCase] Creating ${initialUsers.length} users...`);
    const users = [];

    for (const userData of initialUsers) {
      const user = await this.userRepository.create({
        ...userData,
        organizationId,
        isActive: true,
        deleted: false,
      });
      users.push(user);
      console.log(`[SeedUsersUseCase] ✅ Created user: ${user.email}`);
    }

    return users;
  }
}
