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
import {
  CountryRepository,
  COUNTRY_REPOSITORY,
} from '@domain/location/repositories/country.repository';
import {
  CityRepository,
  CITY_REPOSITORY,
} from '@domain/location/repositories/city.repository';
import {
  NeighborhoodRepository,
  NEIGHBORHOOD_REPOSITORY,
} from '@domain/location/repositories/neighborhood.repository';
import {
  DeveloperRepository,
  DEVELOPER_REPOSITORY,
} from '@domain/developer/repositories/developer.repository';
import {
  ProjectRepository,
  PROJECT_REPOSITORY,
} from '@domain/project/repositories/project.repository';
import {
  MediaRepository,
  MEDIA_REPOSITORY,
} from '@domain/media/repositories/media.repository';
import { Organization } from '@domain/organization/entities/organization.entity';
import { Role } from '@domain/user/value-objects/role.vo';
import { ProjectStatus } from '@domain/project/value-objects/project-status.vo';
import { ProjectVisibility } from '@domain/project/value-objects/project-visibility.vo';
import { ProjectAmenity } from '@domain/project/value-objects/project-amenity.vo';
import { EntityType } from '@domain/media/value-objects/entity-type.vo';
import { MediaType } from '@domain/media/value-objects/media-type.vo';
import { MediaRole } from '@domain/media/value-objects/media-role.vo';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';
import { DrizzleService } from '@infrastructure/persistence/drizzle/drizzle.service';
import { media } from '@infrastructure/persistence/drizzle/schema/media.schema';
import { projects } from '@infrastructure/persistence/drizzle/schema/project.schema';
import { developers } from '@infrastructure/persistence/drizzle/schema/developer.schema';
import { neighborhoods } from '@infrastructure/persistence/drizzle/schema/neighborhood.schema';

const SEED_ORGANIZATIONS = [
  {
    name: 'Inmobiliaria Torrico',
    email: 'contacto@torrico-inmobiliaria.com',
    phone: '+59170123456',
    address: 'Av. Arce #2345, La Paz, Bolivia',
  },
];

const SEED_USERS = [
  {
    name: 'Pietro',
    lastName: 'Torrico Escobar',
    phoneNumber: '69531998',
    email: 'torricopietro@gmail.com',
    password: bcrypt.hashSync('Pietrogato3@', 10),
    roles: [Role.ADMIN],
  },
  {
    name: 'Carlos',
    lastName: 'Mendoza López',
    phoneNumber: '78451233',
    email: 'carlos@test.com',
    password: bcrypt.hashSync('Abc123', 10),
    roles: [Role.SUPER_USER],
  },
  {
    name: 'María',
    lastName: 'Rodriguez',
    phoneNumber: '70123456',
    email: 'maria@test.com',
    password: bcrypt.hashSync('Password123', 10),
    roles: [Role.USER],
  },
];

const SEED_COUNTRIES = [
  { name: 'Bolivia', code: 'BO' },
];

const SEED_CITIES: Record<string, string[]> = {
  BO: ['La Paz', 'Santa Cruz', 'Cochabamba'],
};

const SEED_NEIGHBORHOODS: Record<string, string[]> = {
  'La Paz': ['Calacoto', 'Sopocachi', 'San Miguel'],
  'Santa Cruz': ['Equipetrol', 'Urbarí', 'Las Palmas'],
  'Cochabamba': ['Queru Queru', 'Cala Cala', 'Sarco'],
};

const SEED_DEVELOPER = {
  name: 'Torrico Desarrollos',
  legalName: 'Torrico Desarrollos S.R.L.',
  taxId: '1234567890',
  phone: '+59170123456',
  email: 'desarrollos@torrico.com',
};

const SEED_PROJECTS = [
  {
    name: 'Edificio Vitrubio',
    description:
      'Moderno edificio de 12 pisos en la zona de Calacoto con vista panorámica a los Andes. Departamentos de 1, 2 y 3 dormitorios con acabados premium.',
    address: 'Av. Ballivián #1234, Calacoto',
    neighborhoodName: 'Calacoto',
    cityName: 'La Paz',
    totalFloors: 12,
    totalUnits: 48,
    amenities: [
      ProjectAmenity.POOL,
      ProjectAmenity.GYM,
      ProjectAmenity.ROOFTOP,
      ProjectAmenity.SECURITY_24H,
      ProjectAmenity.LOBBY,
    ],
    defaultCommissionPct: 3.0,
    intentDeadlineHours: 48,
    deliveryDate: new Date('2027-06-30'),
  },
  {
    name: 'Condominio Los Jardines',
    description:
      'Exclusivo condominio residencial con amplios espacios verdes y áreas recreativas para toda la familia.',
    address: 'Calle 21 #500, Equipetrol',
    neighborhoodName: 'Equipetrol',
    cityName: 'Santa Cruz',
    totalFloors: 5,
    totalUnits: 20,
    amenities: [
      ProjectAmenity.POOL,
      ProjectAmenity.PLAYGROUND,
      ProjectAmenity.BBQ_AREA,
      ProjectAmenity.PET_FRIENDLY,
      ProjectAmenity.PARKING_VISITORS,
    ],
    defaultCommissionPct: 2.5,
    intentDeadlineHours: 72,
    deliveryDate: new Date('2026-12-15'),
  },
  {
    name: 'Torre Milenio',
    description:
      'Torre empresarial y residencial en el corazón de Cochabamba. Oficinas y departamentos con tecnología smart home.',
    address: 'Av. América #890',
    neighborhoodName: 'Queru Queru',
    cityName: 'Cochabamba',
    totalFloors: 18,
    totalUnits: 72,
    amenities: [
      ProjectAmenity.COWORKING,
      ProjectAmenity.GYM,
      ProjectAmenity.SMART_HOME,
      ProjectAmenity.SECURITY_24H,
      ProjectAmenity.ROOFTOP,
    ],
    defaultCommissionPct: 2.0,
    intentDeadlineHours: 48,
    deliveryDate: new Date('2028-03-01'),
  },
];

const PLACEHOLDER_MEDIA = {
  cover: {
    url: 'https://picsum.photos/seed/cover/1200/800',
    filename: 'cover.jpg',
    mimeType: 'image/jpeg',
    size: 150000,
  },
  gallery: [
    {
      url: 'https://picsum.photos/seed/gallery1/1200/800',
      filename: 'gallery-1.jpg',
      mimeType: 'image/jpeg',
      size: 120000,
    },
    {
      url: 'https://picsum.photos/seed/gallery2/1200/800',
      filename: 'gallery-2.jpg',
      mimeType: 'image/jpeg',
      size: 130000,
    },
    {
      url: 'https://picsum.photos/seed/gallery3/1200/800',
      filename: 'gallery-3.jpg',
      mimeType: 'image/jpeg',
      size: 110000,
    },
  ],
};

@Injectable()
export class SeedUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: OrganizationRepository,
    @Inject(COUNTRY_REPOSITORY)
    private readonly countryRepository: CountryRepository,
    @Inject(CITY_REPOSITORY)
    private readonly cityRepository: CityRepository,
    @Inject(NEIGHBORHOOD_REPOSITORY)
    private readonly neighborhoodRepository: NeighborhoodRepository,
    @Inject(DEVELOPER_REPOSITORY)
    private readonly developerRepository: DeveloperRepository,
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
    @Inject(MEDIA_REPOSITORY)
    private readonly mediaRepository: MediaRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async execute() {
    try {
      console.log('[Seed] Starting seed process...');

      await this.deleteAllData();

      const countries = await this.createCountries();
      const cities = await this.createCities(countries);
      const neighborhoodMap = await this.createNeighborhoods(cities);
      const organizations = await this.createOrganizations();
      const organizationId = organizations[0].id;
      const users = await this.createUsers(organizationId);
      const developer = await this.createDeveloper(organizationId);
      const createdProjects = await this.createProjects(developer.id, countries, cities, neighborhoodMap);
      await this.createProjectMedia(createdProjects);

      console.log('[Seed] Seed process completed successfully!');

      return {
        message: 'Database seeded successfully',
        summary: {
          organizations: organizations.length,
          users: users.length,
          countries: countries.length,
          cities: Object.values(cities).flat().length,
          neighborhoods: neighborhoodMap.size,
          developers: 1,
          projects: createdProjects.length,
        },
      };
    } catch (error) {
      console.error('[Seed] Error during seed:', error);
      DatabaseErrorHandler.handle(error, 'SeedUseCase');
    }
  }

  private async deleteAllData() {
    console.log('[Seed] Deleting all data...');

    await this.drizzle.db.delete(media);
    await this.drizzle.db.delete(projects);
    await this.drizzle.db.delete(developers);
    await this.userRepository.deleteAll();
    await this.drizzle.db.delete(neighborhoods);

    const allCities = await this.cityRepository.findAll();
    for (const c of allCities) {
      await this.cityRepository.delete(c.id);
    }

    const allCountries = await this.countryRepository.findAll();
    for (const c of allCountries) {
      await this.countryRepository.delete(c.id);
    }

    const allOrgs = await this.organizationRepository.findAll();
    for (const org of allOrgs) {
      await this.organizationRepository.delete(org.id);
    }

    console.log('[Seed] All data deleted');
  }

  private async createCountries() {
    console.log('[Seed] Creating countries...');
    const created: Record<string, { id: string; code: string }> = {};

    for (const data of SEED_COUNTRIES) {
      const country = await this.countryRepository.create(data);
      created[country.code] = { id: country.id, code: country.code };
      console.log(`[Seed] Created country: ${country.name}`);
    }

    return created;
  }

  private async createCities(
    countries: Record<string, { id: string; code: string }>,
  ) {
    console.log('[Seed] Creating cities...');
    const created: Record<string, { id: string; name: string }[]> = {};

    for (const [code, cityNames] of Object.entries(SEED_CITIES)) {
      const country = countries[code];
      if (!country) continue;

      created[code] = [];
      for (const name of cityNames) {
        const city = await this.cityRepository.create({
          name,
          countryId: country.id,
        });
        created[code].push({ id: city.id, name: city.name });
        console.log(`[Seed] Created city: ${city.name}`);
      }
    }

    return created;
  }

  private async createOrganizations() {
    console.log('[Seed] Creating organizations...');
    const created = [];

    for (const orgData of SEED_ORGANIZATIONS) {
      const org = await this.organizationRepository.create({
        ...orgData,
        slug: Organization.generateSlug(orgData.name),
        isActive: true,
        deleted: false,
      });
      created.push(org);
      console.log(`[Seed] Created organization: ${org.name}`);
    }

    return created;
  }

  private async createUsers(organizationId: string) {
    console.log('[Seed] Creating users...');
    const created = [];

    for (const userData of SEED_USERS) {
      const user = await this.userRepository.create({
        ...userData,
        organizationId,
        isActive: true,
        deleted: false,
      });
      created.push(user);
      console.log(`[Seed] Created user: ${user.email}`);
    }

    return created;
  }

  private async createNeighborhoods(
    cities: Record<string, { id: string; name: string }[]>,
  ) {
    console.log('[Seed] Creating neighborhoods...');
    const neighborhoodMap = new Map<string, string>();

    for (const cityList of Object.values(cities)) {
      for (const city of cityList) {
        const names = SEED_NEIGHBORHOODS[city.name] ?? [];
        for (const name of names) {
          const neighborhood = await this.neighborhoodRepository.create({
            name,
            cityId: city.id,
          });
          neighborhoodMap.set(name, neighborhood.id);
          console.log(`[Seed] Created neighborhood: ${name} (${city.name})`);
        }
      }
    }

    return neighborhoodMap;
  }

  private async createDeveloper(organizationId: string) {
    console.log('[Seed] Creating developer...');
    const developer = await this.developerRepository.create({
      ...SEED_DEVELOPER,
      organizationId,
    });
    console.log(`[Seed] Created developer: ${developer.name}`);
    return developer;
  }

  private async createProjects(
    developerId: string,
    countries: Record<string, { id: string; code: string }>,
    cities: Record<string, { id: string; name: string }[]>,
    neighborhoodMap: Map<string, string>,
  ) {
    console.log('[Seed] Creating projects...');
    const created = [];
    const countryId = countries['BO'].id;
    const cityMap = new Map(
      cities['BO'].map((c) => [c.name, c.id]),
    );

    for (const projectData of SEED_PROJECTS) {
      const cityId = cityMap.get(projectData.cityName);
      const neighborhoodId = neighborhoodMap.get(projectData.neighborhoodName);
      if (!cityId || !neighborhoodId) continue;

      const project = await this.projectRepository.create({
        developerId,
        name: projectData.name,
        description: projectData.description,
        address: projectData.address,
        countryId,
        cityId,
        neighborhoodId,
        status: ProjectStatus.DRAFT,
        visibility: ProjectVisibility.PUBLIC,
        deliveryDate: projectData.deliveryDate,
        totalFloors: projectData.totalFloors,
        totalUnits: projectData.totalUnits,
        amenities: projectData.amenities,
        defaultCommissionPct: projectData.defaultCommissionPct,
        intentDeadlineHours: projectData.intentDeadlineHours,
      });
      created.push(project);
      console.log(`[Seed] Created project: ${project.name}`);
    }

    return created;
  }

  private async createProjectMedia(
    projectList: { id: string; name: string }[],
  ) {
    console.log('[Seed] Creating project media...');

    for (const project of projectList) {
      await this.mediaRepository.create({
        entityType: EntityType.PROJECT,
        entityId: project.id,
        mediaType: MediaType.IMAGE,
        role: MediaRole.COVER,
        url: `${PLACEHOLDER_MEDIA.cover.url}/${project.id}`,
        key: `projects/${project.id}/cover/cover.jpg`,
        filename: PLACEHOLDER_MEDIA.cover.filename,
        mimeType: PLACEHOLDER_MEDIA.cover.mimeType,
        size: PLACEHOLDER_MEDIA.cover.size,
        sortOrder: 0,
      });

      for (let i = 0; i < PLACEHOLDER_MEDIA.gallery.length; i++) {
        const img = PLACEHOLDER_MEDIA.gallery[i];
        await this.mediaRepository.create({
          entityType: EntityType.PROJECT,
          entityId: project.id,
          mediaType: MediaType.IMAGE,
          role: MediaRole.GALLERY,
          url: `${img.url}/${project.id}`,
          key: `projects/${project.id}/gallery/gallery-${i + 1}.jpg`,
          filename: img.filename,
          mimeType: img.mimeType,
          size: img.size,
          sortOrder: i + 1,
        });
      }

      console.log(`[Seed] Created media for: ${project.name}`);
    }
  }
}
