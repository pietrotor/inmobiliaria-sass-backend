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
  UnitRepository,
  UNIT_REPOSITORY,
} from '@domain/unit/repositories/unit.repository';
import {
  MediaRepository,
  MEDIA_REPOSITORY,
} from '@domain/media/repositories/media.repository';
import { Organization } from '@domain/organization/entities/organization.entity';
import { UserRole } from '@domain/user/value-objects/role.vo';
import { ProjectStatus } from '@domain/project/value-objects/project-status.vo';
import { ProjectVisibility } from '@domain/project/value-objects/project-visibility.vo';
import { ProjectAmenity } from '@domain/project/value-objects/project-amenity.vo';
import { UnitStatus } from '@domain/unit/value-objects/unit-status.vo';
import { UnitType } from '@domain/unit/value-objects/unit-type.vo';
import { Orientation } from '@domain/unit/value-objects/orientation.vo';
import { UnitAttributes } from '@domain/unit/value-objects/unit-attributes.vo';
import { EntityType } from '@domain/media/value-objects/entity-type.vo';
import { MediaType } from '@domain/media/value-objects/media-type.vo';
import { MediaRole } from '@domain/media/value-objects/media-role.vo';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';
import { DrizzleService } from '@infrastructure/persistence/drizzle/drizzle.service';
import { media } from '@infrastructure/persistence/drizzle/schema/media.schema';
import { units } from '@infrastructure/persistence/drizzle/schema/unit.schema';
import { unitPriceHistory } from '@infrastructure/persistence/drizzle/schema/unit-price-history.schema';
import { projects } from '@infrastructure/persistence/drizzle/schema/project.schema';
import { developers } from '@infrastructure/persistence/drizzle/schema/developer.schema';
import { neighborhoods } from '@infrastructure/persistence/drizzle/schema/neighborhood.schema';
import { organizations } from '@infrastructure/persistence/drizzle/schema/organization.schema';
import { countries } from '@infrastructure/persistence/drizzle/schema/country.schema';
import { cities } from '@infrastructure/persistence/drizzle/schema/city.schema';
import { users } from '@infrastructure/persistence/drizzle/schema/user.schema';
import { postSaleStatusHistory } from '@infrastructure/persistence/drizzle/schema/post-sale-status-history.schema';
import { postSaleRequests } from '@infrastructure/persistence/drizzle/schema/post-sale-request.schema';
import { payments } from '@infrastructure/persistence/drizzle/schema/payment.schema';
import { installments } from '@infrastructure/persistence/drizzle/schema/installment.schema';
import { paymentPlans } from '@infrastructure/persistence/drizzle/schema/payment-plan.schema';
import { commissions } from '@infrastructure/persistence/drizzle/schema/commission.schema';
import { reservations } from '@infrastructure/persistence/drizzle/schema/reservation.schema';
import { waitlists } from '@infrastructure/persistence/drizzle/schema/waitlist.schema';
import { reservationIntents } from '@infrastructure/persistence/drizzle/schema/reservation-intent.schema';
import { commercialProposals } from '@infrastructure/persistence/drizzle/schema/commercial-proposal.schema';
import { leadStatusHistory } from '@infrastructure/persistence/drizzle/schema/lead-status-history.schema';
import { leads } from '@infrastructure/persistence/drizzle/schema/lead.schema';
import { brokerProjectAccess } from '@infrastructure/persistence/drizzle/schema/broker-project-access.schema';
import { brokers } from '@infrastructure/persistence/drizzle/schema/broker.schema';

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
    role: UserRole.DEVELOPER_ADMIN,
  },
  {
    name: 'Carlos',
    lastName: 'Mendoza López',
    phoneNumber: '78451233',
    email: 'carlos@test.com',
    password: bcrypt.hashSync('Abc123', 10),
    role: UserRole.SUPER_ADMIN,
  },
  {
    name: 'María',
    lastName: 'Rodriguez',
    phoneNumber: '70123456',
    email: 'maria@test.com',
    password: bcrypt.hashSync('Password123', 10),
    role: UserRole.DEVELOPER_SALES,
  },
  {
    name: 'Fernando',
    lastName: 'Quispe Mamani',
    phoneNumber: '71234567',
    email: 'fernando@broker.com',
    password: bcrypt.hashSync('Broker123', 10),
    role: UserRole.BROKER,
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

interface SeedUnit {
  identifier: string;
  type: UnitType;
  priceUSD: number;
  commissionPctOverride: number | null;
  attributes: UnitAttributes;
}

const SEED_UNITS: Record<string, SeedUnit[]> = {
  'Edificio Vitrubio': [
    {
      identifier: 'Apto 301',
      type: UnitType.APARTMENT,
      priceUSD: 125000,
      commissionPctOverride: null,
      attributes: {
        type: 'APARTMENT',
        floor: 3,
        sqm: 85.5,
        sqmUsable: 72.0,
        bedrooms: 2,
        bathrooms: 2,
        halfBathrooms: 1,
        orientation: Orientation.NORTH,
        hasBalcony: true,
        hasLaundryRoom: false,
        hasServantRoom: false,
      },
    },
    {
      identifier: 'Apto 501',
      type: UnitType.APARTMENT,
      priceUSD: 155000,
      commissionPctOverride: 3.5,
      attributes: {
        type: 'APARTMENT',
        floor: 5,
        sqm: 120.0,
        sqmUsable: 105.0,
        bedrooms: 3,
        bathrooms: 2,
        halfBathrooms: 1,
        orientation: Orientation.NORTHEAST,
        hasBalcony: true,
        hasLaundryRoom: true,
        hasServantRoom: true,
      },
    },
    {
      identifier: 'E-04',
      type: UnitType.PARKING,
      priceUSD: 15000,
      commissionPctOverride: null,
      attributes: {
        type: 'PARKING',
        level: 'S1',
        spotNumber: 'E-04',
        isCovered: true,
        sqm: 12.5,
      },
    },
    {
      identifier: 'D-02',
      type: UnitType.STORAGE,
      priceUSD: 8000,
      commissionPctOverride: null,
      attributes: {
        type: 'STORAGE',
        level: 'S2',
        sqm: 4.0,
      },
    },
  ],
  'Condominio Los Jardines': [
    {
      identifier: 'Casa 1A',
      type: UnitType.APARTMENT,
      priceUSD: 95000,
      commissionPctOverride: null,
      attributes: {
        type: 'APARTMENT',
        floor: 1,
        sqm: 110.0,
        sqmUsable: 98.0,
        bedrooms: 3,
        bathrooms: 2,
        halfBathrooms: 0,
        orientation: Orientation.EAST,
        hasBalcony: false,
        hasLaundryRoom: true,
        hasServantRoom: false,
      },
    },
    {
      identifier: 'P-01',
      type: UnitType.PARKING,
      priceUSD: 12000,
      commissionPctOverride: null,
      attributes: {
        type: 'PARKING',
        level: 'PB',
        spotNumber: 'P-01',
        isCovered: false,
        sqm: 15.0,
      },
    },
  ],
  'Torre Milenio': [
    {
      identifier: 'Oficina 8A',
      type: UnitType.OFFICE,
      priceUSD: 180000,
      commissionPctOverride: 2.5,
      attributes: {
        type: 'OFFICE',
        floor: 8,
        sqm: 65.0,
        sqmUsable: 58.0,
        bedrooms: null,
        bathrooms: 1,
        halfBathrooms: 1,
        orientation: Orientation.WEST,
        hasBalcony: false,
        hasLaundryRoom: false,
        hasServantRoom: false,
      },
    },
    {
      identifier: 'Local C-01',
      type: UnitType.COMMERCIAL,
      priceUSD: 220000,
      commissionPctOverride: null,
      attributes: {
        type: 'COMMERCIAL',
        floor: 0,
        sqm: 150.0,
        sqmUsable: 140.0,
        bedrooms: null,
        bathrooms: 2,
        halfBathrooms: 0,
        orientation: null,
        hasBalcony: false,
        hasLaundryRoom: false,
        hasServantRoom: false,
      },
    },
    {
      identifier: 'Apto 1201',
      type: UnitType.APARTMENT,
      priceUSD: 195000,
      commissionPctOverride: null,
      attributes: {
        type: 'APARTMENT',
        floor: 12,
        sqm: 95.0,
        sqmUsable: 82.0,
        bedrooms: 2,
        bathrooms: 2,
        halfBathrooms: 0,
        orientation: Orientation.SOUTH,
        hasBalcony: true,
        hasLaundryRoom: false,
        hasServantRoom: false,
      },
    },
  ],
};

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
    @Inject(UNIT_REPOSITORY)
    private readonly unitRepository: UnitRepository,
    @Inject(MEDIA_REPOSITORY)
    private readonly mediaRepository: MediaRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async execute() {
    try {
      console.log('[Seed] Starting seed process...');

      await this.deleteAllData();

      const countriesMap = await this.createCountries();
      const citiesMap = await this.createCities(countriesMap);
      const neighborhoodMap = await this.createNeighborhoods(citiesMap);
      const orgs = await this.createOrganizations();
      const organizationId = orgs[0].id;
      const createdUsers = await this.createUsers(organizationId);
      const developer = await this.createDeveloper(organizationId);
      const createdProjects = await this.createProjects(
        developer.id,
        countriesMap,
        citiesMap,
        neighborhoodMap,
      );
      await this.createProjectMedia(createdProjects);
      const unitCount = await this.createUnits(createdProjects);
      await this.createUnitMedia(createdProjects);

      const brokerUser = createdUsers.find(
        (u) => u.email === 'fernando@broker.com',
      );
      const salesUser = createdUsers.find(
        (u) => u.email === 'maria@test.com',
      );
      const adminUser = createdUsers.find(
        (u) => u.email === 'torricopietro@gmail.com',
      );

      const seedExtras = await this.seedNewModules(
        developer.id,
        createdProjects,
        brokerUser!.id,
        salesUser!.id,
        adminUser!.id,
      );

      console.log('[Seed] Seed process completed successfully!');

      return {
        message: 'Database seeded successfully',
        summary: {
          organizations: orgs.length,
          users: createdUsers.length,
          countries: countriesMap ? Object.keys(countriesMap).length : 0,
          cities: Object.values(citiesMap).flat().length,
          neighborhoods: neighborhoodMap.size,
          developers: 1,
          projects: createdProjects.length,
          units: unitCount,
          ...seedExtras,
        },
      };
    } catch (error) {
      console.error('[Seed] Error during seed:', error);
      DatabaseErrorHandler.handle(error, 'SeedUseCase');
    }
  }

  private async deleteAllData() {
    console.log('[Seed] Deleting all data...');

    await this.drizzle.db.delete(postSaleStatusHistory);
    await this.drizzle.db.delete(postSaleRequests);
    await this.drizzle.db.delete(payments);
    await this.drizzle.db.delete(installments);
    await this.drizzle.db.delete(paymentPlans);
    await this.drizzle.db.delete(commissions);
    await this.drizzle.db.delete(reservations);
    await this.drizzle.db.delete(waitlists);
    await this.drizzle.db.delete(reservationIntents);
    await this.drizzle.db.delete(commercialProposals);
    await this.drizzle.db.delete(leadStatusHistory);
    await this.drizzle.db.delete(leads);
    await this.drizzle.db.delete(brokerProjectAccess);
    await this.drizzle.db.delete(brokers);
    await this.drizzle.db.delete(media);
    await this.drizzle.db.delete(unitPriceHistory);
    await this.drizzle.db.delete(units);
    await this.drizzle.db.delete(projects);
    await this.drizzle.db.delete(developers);
    await this.drizzle.db.delete(users);
    await this.drizzle.db.delete(neighborhoods);
    await this.drizzle.db.delete(cities);
    await this.drizzle.db.delete(countries);
    await this.drizzle.db.delete(organizations);

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

  private async createUnits(
    projectList: { id: string; name: string }[],
  ): Promise<number> {
    console.log('[Seed] Creating units...');
    let totalCreated = 0;

    for (const project of projectList) {
      const unitDefs = SEED_UNITS[project.name] ?? [];

      for (const unitData of unitDefs) {
        await this.unitRepository.create({
          projectId: project.id,
          identifier: unitData.identifier,
          type: unitData.type,
          status: UnitStatus.AVAILABLE,
          priceUSD: unitData.priceUSD,
          commissionPctOverride: unitData.commissionPctOverride,
          attributes: unitData.attributes,
          internalNotes: null,
        });
        totalCreated++;
        console.log(
          `[Seed] Created unit: ${unitData.identifier} (${project.name})`,
        );
      }
    }

    return totalCreated;
  }

  private async createUnitMedia(
    projectList: { id: string; name: string }[],
  ) {
    console.log('[Seed] Creating unit media...');

    for (const project of projectList) {
      const createdUnits = await this.unitRepository.findByProjectId(
        project.id,
        100,
        0,
      );

      for (const unit of createdUnits.data) {
        if (
          unit.type === UnitType.APARTMENT ||
          unit.type === UnitType.OFFICE ||
          unit.type === UnitType.COMMERCIAL
        ) {
          await this.mediaRepository.create({
            entityType: EntityType.UNIT,
            entityId: unit.id,
            mediaType: MediaType.IMAGE,
            role: MediaRole.COVER,
            url: `https://picsum.photos/seed/${unit.id}/800/600`,
            key: `units/${unit.id}/cover/cover.jpg`,
            filename: 'cover.jpg',
            mimeType: 'image/jpeg',
            size: 100000,
            sortOrder: 0,
          });

          await this.mediaRepository.create({
            entityType: EntityType.UNIT,
            entityId: unit.id,
            mediaType: MediaType.IMAGE,
            role: MediaRole.FLOOR_PLAN,
            url: `https://picsum.photos/seed/fp-${unit.id}/800/600`,
            key: `units/${unit.id}/floor-plan/floor-plan.jpg`,
            filename: 'floor-plan.jpg',
            mimeType: 'image/jpeg',
            size: 80000,
            sortOrder: 0,
          });

          console.log(`[Seed] Created media for unit: ${unit.identifier}`);
        }
      }
    }
  }

  private async seedNewModules(
    developerId: string,
    projectList: { id: string; name: string }[],
    brokerUserId: string,
    salesUserId: string,
    adminUserId: string,
  ) {
    console.log('[Seed] Seeding new modules...');

    const vitrubio = projectList.find((p) => p.name === 'Edificio Vitrubio')!;
    const jardines = projectList.find(
      (p) => p.name === 'Condominio Los Jardines',
    )!;

    const vitrubioUnits = await this.unitRepository.findByProjectId(
      vitrubio.id,
      100,
      0,
    );
    const jardinesUnits = await this.unitRepository.findByProjectId(
      jardines.id,
      100,
      0,
    );

    const apt301 = vitrubioUnits.data.find(
      (u) => u.identifier === 'Apto 301',
    )!;
    const apt501 = vitrubioUnits.data.find(
      (u) => u.identifier === 'Apto 501',
    )!;
    const parking = vitrubioUnits.data.find(
      (u) => u.identifier === 'E-04',
    )!;
    const casa1a = jardinesUnits.data.find(
      (u) => u.identifier === 'Casa 1A',
    )!;

    // --- Broker ---
    const [broker] = await this.drizzle.db
      .insert(brokers)
      .values({
        userId: brokerUserId,
        plan: 'PRO',
        status: 'APPROVED',
        companyName: 'Quispe Bienes Raíces',
        licenseNumber: 'BRK-LP-2025-0042',
      })
      .returning();
    console.log(`[Seed] Created broker: ${broker.companyName}`);

    // --- Broker Project Access ---
    const [access1] = await this.drizzle.db
      .insert(brokerProjectAccess)
      .values({
        brokerId: broker.id,
        projectId: vitrubio.id,
        status: 'ACCEPTED',
      })
      .returning();
    const [access2] = await this.drizzle.db
      .insert(brokerProjectAccess)
      .values({
        brokerId: broker.id,
        projectId: jardines.id,
        status: 'INVITED',
      })
      .returning();
    console.log('[Seed] Created broker project access entries');

    // --- Leads ---
    const leadDataList = [
      {
        developerId,
        assignedExecutiveId: salesUserId,
        fullName: 'Ana Lucía Vargas Pinto',
        nationalId: '5678901',
        phone: '+59172345678',
        email: 'ana.vargas@email.com',
        source: 'WALK_IN' as const,
        status: 'VISITED' as const,
        interestedUnitIds: [apt301.id],
        notes: 'Visitó el departamento modelo, muy interesada en vista norte.',
      },
      {
        developerId,
        assignedExecutiveId: salesUserId,
        fullName: 'Roberto Fernández Guzmán',
        nationalId: '4321098',
        phone: '+59178654321',
        email: 'roberto.f@email.com',
        source: 'REFERRAL' as const,
        status: 'QUOTED' as const,
        interestedUnitIds: [apt501.id, parking.id],
        notes:
          'Referido por cliente anterior. Busca departamento de 3 dormitorios con parqueo.',
      },
      {
        developerId,
        assignedExecutiveId: null,
        fullName: 'Carla Mendoza Ortiz',
        nationalId: '8765432',
        phone: '+59176543210',
        email: null,
        source: 'SOCIAL_MEDIA' as const,
        status: 'NEW' as const,
        interestedUnitIds: [casa1a.id],
        notes: 'Contactó por Instagram, interesada en casas en Santa Cruz.',
      },
    ];

    const createdLeads = [];
    for (const ld of leadDataList) {
      const [lead] = await this.drizzle.db
        .insert(leads)
        .values(ld)
        .returning();
      createdLeads.push(lead);
      console.log(`[Seed] Created lead: ${lead.fullName}`);
    }

    // --- Lead Status History ---
    const leadHistoryEntries = [
      {
        leadId: createdLeads[0].id,
        fromStatus: 'NEW' as const,
        toStatus: 'CONTACTED' as const,
        changedByUserId: salesUserId,
      },
      {
        leadId: createdLeads[0].id,
        fromStatus: 'CONTACTED' as const,
        toStatus: 'VISITED' as const,
        changedByUserId: salesUserId,
      },
      {
        leadId: createdLeads[1].id,
        fromStatus: 'NEW' as const,
        toStatus: 'CONTACTED' as const,
        changedByUserId: salesUserId,
      },
      {
        leadId: createdLeads[1].id,
        fromStatus: 'CONTACTED' as const,
        toStatus: 'VISITED' as const,
        changedByUserId: salesUserId,
      },
      {
        leadId: createdLeads[1].id,
        fromStatus: 'VISITED' as const,
        toStatus: 'QUOTED' as const,
        changedByUserId: salesUserId,
      },
    ];
    await this.drizzle.db.insert(leadStatusHistory).values(leadHistoryEntries);
    console.log(
      `[Seed] Created ${leadHistoryEntries.length} lead status history entries`,
    );

    // --- Commercial Proposals ---
    const now = new Date();
    const validUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const [proposalBroker] = await this.drizzle.db
      .insert(commercialProposals)
      .values({
        type: 'BROKER',
        brokerId: broker.id,
        developerId,
        clientName: 'Jorge Gutiérrez Soliz',
        clientNationalId: '1122334',
        clientPhone: '+59173456789',
        clientEmail: 'jorge.gutierrez@email.com',
        units: [
          {
            unitId: apt301.id,
            identifier: 'Apto 301',
            priceUSD: 125000,
            commissionPct: 3.0,
          },
        ],
        totalPriceUSD: 125000,
        estimatedCommissionUSD: 3750,
        generatedAt: now,
        validUntil,
      })
      .returning();

    const [proposalDirect] = await this.drizzle.db
      .insert(commercialProposals)
      .values({
        type: 'DIRECT',
        executiveId: salesUserId,
        developerId,
        clientName: 'Mónica Salazar Ríos',
        clientNationalId: '9988776',
        clientPhone: '+59174567890',
        clientEmail: 'monica.salazar@email.com',
        units: [
          {
            unitId: apt501.id,
            identifier: 'Apto 501',
            priceUSD: 155000,
            commissionPct: 3.5,
          },
          {
            unitId: parking.id,
            identifier: 'E-04',
            priceUSD: 15000,
            commissionPct: 3.0,
          },
        ],
        totalPriceUSD: 170000,
        estimatedCommissionUSD: 5875,
        generatedAt: now,
        validUntil,
      })
      .returning();
    console.log('[Seed] Created 2 commercial proposals');

    // --- Reservation Intent (APPROVED → will create reservation) ---
    const intentDeadline = new Date(
      now.getTime() + 48 * 60 * 60 * 1000,
    );
    const [approvedIntent] = await this.drizzle.db
      .insert(reservationIntents)
      .values({
        brokerId: broker.id,
        projectId: vitrubio.id,
        unitIds: [apt301.id],
        clientName: 'Jorge Gutiérrez Soliz',
        clientNationalId: '1122334',
        clientPhone: '+59173456789',
        clientEmail: 'jorge.gutierrez@email.com',
        hasFinancing: false,
        hasVisited: true,
        status: 'APPROVED',
        deadlineAt: intentDeadline,
      })
      .returning();

    // --- Reservation Intent (ACTIVE – still counting down) ---
    const activeDeadline = new Date(
      now.getTime() + 36 * 60 * 60 * 1000,
    );
    const [activeIntent] = await this.drizzle.db
      .insert(reservationIntents)
      .values({
        brokerId: broker.id,
        projectId: jardines.id,
        unitIds: [casa1a.id],
        clientName: 'Patricia Huanca Mamani',
        clientNationalId: '5544332',
        clientPhone: '+59175678901',
        hasFinancing: true,
        hasVisited: true,
        status: 'ACTIVE',
        deadlineAt: activeDeadline,
      })
      .returning();
    console.log('[Seed] Created 2 reservation intents');

    // --- Reservation (from approved intent) ---
    const [reservation] = await this.drizzle.db
      .insert(reservations)
      .values({
        unitIds: [apt301.id],
        clientName: 'Jorge Gutiérrez Soliz',
        clientNationalId: '1122334',
        clientPhone: '+59173456789',
        clientEmail: 'jorge.gutierrez@email.com',
        salesChannel: 'BROKER',
        brokerId: broker.id,
        intentId: approvedIntent.id,
        developerId,
        reservationPaymentAmount: 5000,
        reservationPaymentCurrency: 'USD',
        reservationPaymentDate: now,
        agreementDeadline: new Date(
          now.getTime() + 15 * 24 * 60 * 60 * 1000,
        ),
        status: 'RESERVED',
      })
      .returning();
    console.log(`[Seed] Created reservation: ${reservation.id}`);

    // --- Payment Plan ---
    const [paymentPlan] = await this.drizzle.db
      .insert(paymentPlans)
      .values({
        reservationId: reservation.id,
        createdByUserId: adminUserId,
      })
      .returning();
    console.log(`[Seed] Created payment plan: ${paymentPlan.id}`);

    // --- Installments ---
    const installmentData = [
      {
        paymentPlanId: paymentPlan.id,
        description: 'Reserva / Anticipo',
        amount: 5000,
        currency: 'USD',
        dueDate: now,
        status: 'PAID' as const,
      },
      {
        paymentPlanId: paymentPlan.id,
        description: 'Cuota 1 - Firma de contrato',
        amount: 30000,
        currency: 'USD',
        dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        status: 'PENDING' as const,
      },
      {
        paymentPlanId: paymentPlan.id,
        description: 'Cuota 2 - Avance de obra 50%',
        amount: 45000,
        currency: 'USD',
        dueDate: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
        status: 'PENDING' as const,
      },
      {
        paymentPlanId: paymentPlan.id,
        description: 'Cuota final - Contra entrega',
        amount: 45000,
        currency: 'USD',
        dueDate: new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000),
        status: 'PENDING' as const,
      },
    ];
    const createdInstallments = await this.drizzle.db
      .insert(installments)
      .values(installmentData)
      .returning();
    console.log(
      `[Seed] Created ${createdInstallments.length} installments`,
    );

    // --- Payment (for the first paid installment) ---
    const paidInstallment = createdInstallments[0];
    const [payment] = await this.drizzle.db
      .insert(payments)
      .values({
        installmentId: paidInstallment.id,
        amount: 5000,
        receivedDate: now,
        paymentMethod: 'BANK_TRANSFER',
        reference: 'TRX-20260404-001',
        recordedByUserId: adminUserId,
      })
      .returning();
    console.log(`[Seed] Created payment: ${payment.id}`);

    // --- Commission ---
    const [commission] = await this.drizzle.db
      .insert(commissions)
      .values({
        brokerId: broker.id,
        intentId: approvedIntent.id,
        reservationId: reservation.id,
        developerId,
        units: [
          {
            unitId: apt301.id,
            identifier: 'Apto 301',
            priceUSD: 125000,
            commissionPct: 3.0,
            commissionUSD: 3750,
          },
        ],
        totalAmountUSD: 3750,
        status: 'PENDING',
      })
      .returning();
    console.log(`[Seed] Created commission: $${commission.totalAmountUSD}`);

    // --- Post-Sale Request ---
    const [postSaleReq] = await this.drizzle.db
      .insert(postSaleRequests)
      .values({
        unitId: apt301.id,
        reservationId: reservation.id,
        requestType: 'INQUIRY',
        description:
          'Consulta sobre fecha exacta de entrega y documentos necesarios para escrituración.',
        assignedToUserId: salesUserId,
        status: 'OPEN',
        resolutionDeadline: new Date(
          now.getTime() + 7 * 24 * 60 * 60 * 1000,
        ),
        registrationDate: now,
      })
      .returning();
    console.log(`[Seed] Created post-sale request: ${postSaleReq.id}`);

    // --- Waitlist entry ---
    const [waitlistEntry] = await this.drizzle.db
      .insert(waitlists)
      .values({
        unitId: apt301.id,
        brokerId: broker.id,
        position: 1,
        status: 'WAITING',
      })
      .returning();
    console.log(`[Seed] Created waitlist entry: ${waitlistEntry.id}`);

    console.log('[Seed] New modules seeded successfully!');

    return {
      brokers: 1,
      brokerAccess: 2,
      leads: createdLeads.length,
      leadHistory: leadHistoryEntries.length,
      proposals: 2,
      intents: 2,
      reservations: 1,
      paymentPlans: 1,
      installments: createdInstallments.length,
      payments: 1,
      commissions: 1,
      postSaleRequests: 1,
      waitlistEntries: 1,
    };
  }
}
