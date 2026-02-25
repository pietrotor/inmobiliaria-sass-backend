import { Inject, Injectable } from '@nestjs/common';

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
  PropertyRepository,
  PROPERTY_REPOSITORY,
} from '@domain/property/repositories/property.repository';
import {
  PropertyImageRepository,
  PROPERTY_IMAGE_REPOSITORY,
} from '@domain/property/repositories/property-image.repository';
import {
  PropertyPriceRepository,
  PROPERTY_PRICE_REPOSITORY,
} from '@domain/property/repositories/property-price.repository';
import {
  OrganizationRepository,
  ORGANIZATION_REPOSITORY,
} from '@domain/organization/repositories/organization.repository';

import { PropertyType } from '@domain/property/value-objects/property-type.vo';
import { TransactionType } from '@domain/property/value-objects/transaction-type.vo';
import { PropertyStatus } from '@domain/property/value-objects/property-status.vo';
import { Currency } from '@domain/property/value-objects/currency.vo';
import { PropertyCondition } from '@domain/property/value-objects/property-condition.vo';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

// ── Seed Data ───────────────────────────────────────────────────────

const SEED_COUNTRIES = [
  { name: 'Bolivia', code: 'BO' },
  { name: 'Argentina', code: 'AR' },
  { name: 'Colombia', code: 'CO' },
  { name: 'Venezuela', code: 'VE' },
  { name: 'México', code: 'MX' },
  { name: 'Perú', code: 'PE' },
  { name: 'Chile', code: 'CL' },
  { name: 'Uruguay', code: 'UY' },
  { name: 'Brasil', code: 'BR' },
  { name: 'Ecuador', code: 'EC' },
  { name: 'Paraguay', code: 'PY' },
  { name: 'Estados Unidos', code: 'US' },
  { name: 'España', code: 'ES' },
];

// Cities indexed by country code
const SEED_CITIES: Record<string, string[]> = {
  BO: [
    'Santa Cruz de la Sierra',
    'La Paz',
    'Cochabamba',
    'Sucre',
    'Tarija',
    'Oruro',
    'Trinidad',
  ],
  AR: [
    'Buenos Aires',
    'Córdoba',
    'Rosario',
    'Mendoza',
    'San Miguel de Tucumán',
    'Mar del Plata',
  ],
  CO: [
    'Bogotá',
    'Medellín',
    'Cali',
    'Barranquilla',
    'Cartagena',
    'Bucaramanga',
  ],
  VE: ['Caracas', 'Maracaibo', 'Valencia', 'Barquisimeto', 'Mérida'],
  MX: [
    'Ciudad de México',
    'Guadalajara',
    'Monterrey',
    'Cancún',
    'Puebla',
    'Querétaro',
  ],
  PE: ['Lima', 'Cusco', 'Arequipa', 'Trujillo'],
  CL: ['Santiago', 'Valparaíso', 'Concepción', 'Viña del Mar'],
  UY: ['Montevideo', 'Punta del Este', 'Colonia del Sacramento'],
  BR: ['São Paulo', 'Río de Janeiro', 'Brasilia', 'Florianópolis', 'Curitiba'],
  EC: ['Quito', 'Guayaquil', 'Cuenca'],
  PY: ['Asunción', 'Ciudad del Este', 'Encarnación'],
  US: ['Miami', 'Houston', 'Los Angeles', 'New York'],
  ES: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla'],
};

// Neighborhoods indexed by city name
const SEED_NEIGHBORHOODS: Record<string, string[]> = {
  'Santa Cruz de la Sierra': [
    'Equipetrol',
    'Urbarí',
    'Las Palmas',
    'Hamacas',
    'Plan 3000',
    'Radial 26',
    'Centro',
    'Cala Cala',
    'Los Mangales',
    'Sirari',
    'Guapay',
    'Norte Integrado',
  ],
  'La Paz': [
    'Sopocachi',
    'San Miguel',
    'Calacoto',
    'Achumani',
    'Zona Sur',
    'Miraflores',
    'Centro',
    'Obrajes',
    'Irpavi',
  ],
  Cochabamba: [
    'Recoleta',
    'Cala Cala',
    'Queru Queru',
    'Temporal',
    'Sarco',
    'Tupuraya',
    'Norte',
    'Centro',
  ],
  'Buenos Aires': [
    'Palermo',
    'Recoleta',
    'Belgrano',
    'Puerto Madero',
    'San Telmo',
    'Caballito',
    'Núñez',
    'Villa Crespo',
    'Barracas',
  ],
  Bogotá: [
    'Chapinero',
    'Usaquén',
    'Chicó',
    'Rosales',
    'Santa Bárbara',
    'La Candelaria',
    'Cedritos',
    'Salitre',
  ],
  Caracas: [
    'Las Mercedes',
    'Altamira',
    'Chacao',
    'El Rosal',
    'La Castellana',
    'Los Palos Grandes',
    'Chuao',
    'Bello Monte',
  ],
  'Ciudad de México': [
    'Polanco',
    'Condesa',
    'Roma Norte',
    'Roma Sur',
    'Santa Fe',
    'Del Valle',
    'Coyoacán',
    'Narvarte',
  ],
  Lima: [
    'Miraflores',
    'San Isidro',
    'Barranco',
    'Surco',
    'La Molina',
    'San Borja',
    'Magdalena',
  ],
  Santiago: [
    'Providencia',
    'Las Condes',
    'Vitacura',
    'Ñuñoa',
    'La Reina',
    'Lo Barnechea',
    'Recoleta',
  ],
  Miami: [
    'Brickell',
    'Wynwood',
    'South Beach',
    'Coral Gables',
    'Downtown',
    'Coconut Grove',
    'Key Biscayne',
    'Doral',
  ],
};

// ── Property templates ──────────────────────────────────────────────

interface PropertySeed {
  title: string;
  propertyType: PropertyType;
  transactionType: TransactionType;
  currency: Currency;
  price: number;
  description: string;
  shortDescription: string;
  bedrooms?: number;
  bathrooms?: number;
  totalArea?: number;
  coveredArea?: number;
  garages?: number;
  yearBuilt?: number;
  condition: PropertyCondition;
  hasPool?: boolean;
  hasGarden?: boolean;
  hasTerrace?: boolean;
  hasBalcony?: boolean;
  hasAirConditioning?: boolean;
  hasHeating?: boolean;
  hasElevator?: boolean;
  hasGym?: boolean;
  hasSecurity?: boolean;
  hasFireplace?: boolean;
  hasGrill?: boolean;
  hasWaterTank?: boolean;
  hasLaundryRoom?: boolean;
  isFurnished?: boolean;
  isFeatured: boolean;
  stories?: number;
  extraPrices?: { currency: Currency; price: number }[];
  imageUrls?: string[];
}

const PROPERTY_TEMPLATES: PropertySeed[] = [
  {
    title: 'Apartamento moderno en zona exclusiva',
    propertyType: PropertyType.APARTMENT,
    transactionType: TransactionType.SALE,
    currency: Currency.USD,
    price: 185000,
    description:
      'Hermoso apartamento con acabados de primera, cocina integral, pisos de porcelanato y amplios ventanales con vista panorámica. Ubicado en una zona residencial con acceso a todas las comodidades.',
    shortDescription: 'Apartamento moderno con vista panorámica',
    bedrooms: 3,
    bathrooms: 2,
    totalArea: 120,
    coveredArea: 110,
    garages: 1,
    yearBuilt: 2022,
    condition: PropertyCondition.NEW,
    hasBalcony: true,
    hasAirConditioning: true,
    hasElevator: true,
    hasSecurity: true,
    hasGym: true,
    isFeatured: true,
    extraPrices: [{ currency: Currency.VES, price: 6800000 }],
    imageUrls: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    ],
  },
  {
    title: 'Casa familiar con piscina y jardín',
    propertyType: PropertyType.HOUSE,
    transactionType: TransactionType.SALE,
    currency: Currency.USD,
    price: 320000,
    description:
      'Amplia casa de dos plantas con piscina climatizada, jardín con riego automático, barbacoa, sala de estar, sala de juegos y estacionamiento para 3 vehículos. Ideal para familia grande.',
    shortDescription: 'Casa espaciosa con piscina y jardín',
    bedrooms: 5,
    bathrooms: 3,
    totalArea: 350,
    coveredArea: 280,
    garages: 3,
    yearBuilt: 2019,
    condition: PropertyCondition.USED,
    hasPool: true,
    hasGarden: true,
    hasTerrace: true,
    hasAirConditioning: true,
    hasGrill: true,
    hasSecurity: true,
    isFeatured: true,
    stories: 2,
    extraPrices: [{ currency: Currency.VES, price: 11750000 }],
    imageUrls: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
    ],
  },
  {
    title: 'Oficina premium en torre corporativa',
    propertyType: PropertyType.OFFICE,
    transactionType: TransactionType.RENT,
    currency: Currency.USD,
    price: 2500,
    description:
      'Oficina de diseño abierto en piso alto de torre corporativa clase A. Incluye sala de reuniones, recepción, kitchenette y vista a la ciudad. Edificio con seguridad 24h, estacionamiento y áreas comunes.',
    shortDescription: 'Oficina en torre corporativa con vista a la ciudad',
    bathrooms: 2,
    totalArea: 150,
    coveredArea: 150,
    garages: 2,
    yearBuilt: 2021,
    condition: PropertyCondition.NEW,
    hasAirConditioning: true,
    hasElevator: true,
    hasSecurity: true,
    isFeatured: false,
    imageUrls: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
    ],
  },
  {
    title: 'Penthouse de lujo con terraza panorámica',
    propertyType: PropertyType.PENTHOUSE,
    transactionType: TransactionType.SALE,
    currency: Currency.USD,
    price: 550000,
    description:
      'Espectacular penthouse duplex con terraza de 80m², jacuzzi, parrilla y vista 360° de la ciudad. Cocina de diseño italiano, vestidor walk-in, domótica completa. El máximo lujo y confort.',
    shortDescription: 'Penthouse dúplex con terraza y jacuzzi',
    bedrooms: 4,
    bathrooms: 4,
    totalArea: 280,
    coveredArea: 200,
    garages: 2,
    yearBuilt: 2023,
    condition: PropertyCondition.NEW,
    hasTerrace: true,
    hasBalcony: true,
    hasAirConditioning: true,
    hasElevator: true,
    hasSecurity: true,
    hasGym: true,
    hasGrill: true,
    isFurnished: true,
    isFeatured: true,
    stories: 2,
    extraPrices: [{ currency: Currency.EUR, price: 510000 }],
    imageUrls: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800',
    ],
  },
  {
    title: 'Terreno en zona de crecimiento',
    propertyType: PropertyType.LAND,
    transactionType: TransactionType.SALE,
    currency: Currency.USD,
    price: 45000,
    description:
      'Terreno de 500m² en zona de expansión urbana con todos los servicios básicos (agua, luz, gas, alcantarillado). Ideal para construir vivienda unifamiliar o proyecto de inversión. Documentación al día.',
    shortDescription: 'Terreno 500m² con servicios básicos',
    totalArea: 500,
    condition: PropertyCondition.NEW,
    isFeatured: false,
    imageUrls: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
    ],
  },
  {
    title: 'Dúplex a estrenar con cochera doble',
    propertyType: PropertyType.DUPLEX,
    transactionType: TransactionType.SALE,
    currency: Currency.USD,
    price: 210000,
    description:
      'Hermoso dúplex a estrenar en condominio cerrado. Planta baja: living-comedor, cocina integrada, lavadero, baño social. Planta alta: 3 dormitorios, baño completo, balcón. Cochera para 2 autos.',
    shortDescription: 'Dúplex nuevo en condominio cerrado',
    bedrooms: 3,
    bathrooms: 2,
    totalArea: 180,
    coveredArea: 160,
    garages: 2,
    yearBuilt: 2024,
    condition: PropertyCondition.NEW,
    hasBalcony: true,
    hasAirConditioning: true,
    hasSecurity: true,
    hasLaundryRoom: true,
    isFeatured: false,
    stories: 2,
    imageUrls: [
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
    ],
  },
  {
    title: 'Local comercial en avenida principal',
    propertyType: PropertyType.COMMERCIAL,
    transactionType: TransactionType.RENT,
    currency: Currency.USD,
    price: 1800,
    description:
      'Local comercial con excelente visibilidad en avenida principal. Gran fachada de vidrio, dos plantas, baño para personal y clientes. Alto tráfico peatonal y vehicular. Ideal para restaurante, tienda o showroom.',
    shortDescription: 'Local comercial con gran visibilidad',
    bathrooms: 2,
    totalArea: 200,
    coveredArea: 200,
    yearBuilt: 2018,
    condition: PropertyCondition.USED,
    hasAirConditioning: true,
    isFeatured: false,
    stories: 2,
    imageUrls: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    ],
  },
  {
    title: 'Estudio amoblado con vista al parque',
    propertyType: PropertyType.STUDIO,
    transactionType: TransactionType.RENT,
    currency: Currency.USD,
    price: 450,
    description:
      'Moderno estudio totalmente amoblado con kitchenette, baño completo, espacio de trabajo y cama matrimonial. Edificio con lavandería, gimnasio y seguridad. Incluye internet y servicios básicos.',
    shortDescription: 'Estudio amoblado con servicios incluidos',
    bedrooms: 1,
    bathrooms: 1,
    totalArea: 40,
    coveredArea: 40,
    yearBuilt: 2020,
    condition: PropertyCondition.NEW,
    hasAirConditioning: true,
    hasElevator: true,
    hasSecurity: true,
    hasGym: true,
    isFurnished: true,
    isFeatured: false,
    imageUrls: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800',
    ],
  },
  {
    title: 'Casa de campo con vista a las montañas',
    propertyType: PropertyType.COUNTRY_HOUSE,
    transactionType: TransactionType.SALE,
    currency: Currency.USD,
    price: 175000,
    description:
      'Encantadora casa de campo rodeada de naturaleza con vista espectacular a las montañas. 3 habitaciones, chimenea, cocina rústica, amplio terreno con árboles frutales. Perfecta para descanso y retiro.',
    shortDescription: 'Casa de campo con vista a las montañas',
    bedrooms: 3,
    bathrooms: 2,
    totalArea: 2000,
    coveredArea: 180,
    garages: 1,
    yearBuilt: 2015,
    condition: PropertyCondition.USED,
    hasGarden: true,
    hasFireplace: true,
    hasGrill: true,
    hasWaterTank: true,
    isFeatured: true,
    stories: 1,
    imageUrls: [
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
    ],
  },
  {
    title: 'Departamento de alquiler temporal céntrico',
    propertyType: PropertyType.APARTMENT,
    transactionType: TransactionType.TEMPORARY_RENT,
    currency: Currency.USD,
    price: 80,
    description:
      'Departamento ideal para estadías cortas o turismo. Completamente amoblado y equipado. Ubicación céntrica a pasos de restaurantes, transporte y atracciones turísticas. WiFi de alta velocidad incluido.',
    shortDescription: 'Departamento céntrico para alquiler temporal',
    bedrooms: 2,
    bathrooms: 1,
    totalArea: 65,
    coveredArea: 65,
    yearBuilt: 2017,
    condition: PropertyCondition.REMODELED,
    hasAirConditioning: true,
    hasElevator: true,
    isFurnished: true,
    isFeatured: false,
    imageUrls: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    ],
  },
  {
    title: 'Loft industrial remodelado',
    propertyType: PropertyType.LOFT,
    transactionType: TransactionType.SALE,
    currency: Currency.USD,
    price: 165000,
    description:
      'Espectacular loft de estilo industrial con techos altos de 4.5m, ladrillo visto, pisos de cemento pulido y grandes ventanales. Espacio diáfano, cocina gourmet y mezzanine como dormitorio. Una pieza única.',
    shortDescription: 'Loft industrial con techos altos',
    bedrooms: 1,
    bathrooms: 1,
    totalArea: 95,
    coveredArea: 95,
    yearBuilt: 2020,
    condition: PropertyCondition.REMODELED,
    hasAirConditioning: true,
    isFeatured: true,
    imageUrls: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800',
    ],
  },
  {
    title: 'Galpón con acceso a ruta principal',
    propertyType: PropertyType.WAREHOUSE,
    transactionType: TransactionType.RENT,
    currency: Currency.USD,
    price: 3500,
    description:
      'Galpón de 800m² con altura libre de 8m, portón para camiones, oficina administrativa, baños y amplio patio de maniobras. Acceso directo a ruta principal. Ideal para logística o manufactura.',
    shortDescription: 'Galpón con acceso a ruta',
    bathrooms: 2,
    totalArea: 1200,
    coveredArea: 800,
    garages: 0,
    yearBuilt: 2010,
    condition: PropertyCondition.USED,
    isFeatured: false,
    imageUrls: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
    ],
  },
];

@Injectable()
export class SeedPropertiesUseCase {
  constructor(
    @Inject(COUNTRY_REPOSITORY)
    private readonly countryRepository: CountryRepository,
    @Inject(CITY_REPOSITORY)
    private readonly cityRepository: CityRepository,
    @Inject(NEIGHBORHOOD_REPOSITORY)
    private readonly neighborhoodRepository: NeighborhoodRepository,
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(PROPERTY_IMAGE_REPOSITORY)
    private readonly propertyImageRepository: PropertyImageRepository,
    @Inject(PROPERTY_PRICE_REPOSITORY)
    private readonly propertyPriceRepository: PropertyPriceRepository,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async execute() {
    try {
      console.log('[SeedProperties] 🌱 Starting seed process...');

      // 1. Get the first organization (must exist from user seed)
      const organizations = await this.organizationRepository.findAll();
      if (organizations.length === 0) {
        throw new Error(
          'No organizations found. Run the user seed first (GET /api/v1/seed).',
        );
      }
      const organizationId = organizations[0].id;
      console.log(
        `[SeedProperties] Using organization: ${organizations[0].name} (${organizationId})`,
      );

      // 2. Seed locations
      const locationIds = await this.seedLocations();

      // 3. Seed properties
      const propertyCount = await this.seedProperties(
        organizationId,
        locationIds,
      );

      console.log('[SeedProperties] ✅ Seed completed!');

      return {
        message: 'Properties seed completed successfully',
        organization: organizations[0].name,
        locations: {
          countries: locationIds.countryIds.size,
          cities: locationIds.cityIds.size,
          neighborhoods: locationIds.neighborhoodIds.size,
        },
        properties: propertyCount,
      };
    } catch (error) {
      console.error('[SeedProperties] ❌ Error:', error);
      DatabaseErrorHandler.handle(error, 'SeedPropertiesUseCase');
    }
  }

  // ── Seed Locations ──────────────────────────────────────────────────

  private async seedLocations() {
    const countryIds = new Map<string, string>(); // code → id
    const cityIds = new Map<string, string>(); // name → id
    const neighborhoodIds = new Map<string, string>(); // name → id

    // Check if locations already exist
    const existingCountries = await this.countryRepository.findAll();
    if (existingCountries.length > 0) {
      console.log(
        `[SeedProperties] 📍 Locations already exist (${existingCountries.length} countries). Mapping existing...`,
      );
      for (const c of existingCountries) {
        countryIds.set(c.code, c.id);
      }
      const existingCities = await this.cityRepository.findAll();
      for (const c of existingCities) {
        cityIds.set(c.name, c.id);
      }
      const existingNeighborhoods = await this.neighborhoodRepository.findAll();
      for (const n of existingNeighborhoods) {
        neighborhoodIds.set(n.name, n.id);
      }
      return { countryIds, cityIds, neighborhoodIds };
    }

    // Create countries
    console.log(
      `[SeedProperties] 🌎 Creating ${SEED_COUNTRIES.length} countries...`,
    );
    for (const countryData of SEED_COUNTRIES) {
      const country = await this.countryRepository.create(countryData);
      countryIds.set(country.code, country.id);
      console.log(
        `[SeedProperties]   ✅ ${country.name} (${country.code})`,
      );
    }

    // Create cities
    let cityCount = 0;
    for (const [countryCode, cities] of Object.entries(SEED_CITIES)) {
      const countryId = countryIds.get(countryCode);
      if (!countryId) continue;

      for (const cityName of cities) {
        const city = await this.cityRepository.create({
          name: cityName,
          countryId,
        });
        cityIds.set(city.name, city.id);
        cityCount++;
      }
    }
    console.log(`[SeedProperties] 🏙️  Created ${cityCount} cities`);

    // Create neighborhoods
    let neighborhoodCount = 0;
    for (const [cityName, neighborhoods] of Object.entries(
      SEED_NEIGHBORHOODS,
    )) {
      const cityId = cityIds.get(cityName);
      if (!cityId) continue;

      for (const neighborhoodName of neighborhoods) {
        const neighborhood = await this.neighborhoodRepository.create({
          name: neighborhoodName,
          cityId,
        });
        neighborhoodIds.set(neighborhood.name, neighborhood.id);
        neighborhoodCount++;
      }
    }
    console.log(
      `[SeedProperties] 🏘️  Created ${neighborhoodCount} neighborhoods`,
    );

    return { countryIds, cityIds, neighborhoodIds };
  }

  // ── Seed Properties ─────────────────────────────────────────────────

  private async seedProperties(
    organizationId: string,
    locationIds: {
      countryIds: Map<string, string>;
      cityIds: Map<string, string>;
      neighborhoodIds: Map<string, string>;
    },
  ): Promise<number> {
    console.log(
      `[SeedProperties] 🏠 Creating ${PROPERTY_TEMPLATES.length} properties...`,
    );

    // Assign each property to a random location from our seed data
    const locationAssignments = this.buildLocationAssignments(locationIds);

    let count = 0;
    for (let i = 0; i < PROPERTY_TEMPLATES.length; i++) {
      const template = PROPERTY_TEMPLATES[i];
      const location = locationAssignments[i % locationAssignments.length];

      const slug = this.generateSlug(template.title, i);

      // Create the property
      const property = await this.propertyRepository.create({
        organizationId,
        title: template.title,
        slug,
        propertyType: template.propertyType,
        transactionType: template.transactionType,
        status: PropertyStatus.ACTIVE,
        currency: template.currency,
        price: template.price,
        pricePerSqm:
          template.totalArea && template.totalArea > 0
            ? Math.round((template.price / template.totalArea) * 100) / 100
            : undefined,
        description: template.description,
        shortDescription: template.shortDescription,
        countryId: location.countryId,
        cityId: location.cityId,
        neighborhoodId: location.neighborhoodId,
        address: `Av. Principal #${100 + i * 50}`,
        totalArea: template.totalArea,
        coveredArea: template.coveredArea,
        bedrooms: template.bedrooms,
        bathrooms: template.bathrooms,
        garages: template.garages,
        yearBuilt: template.yearBuilt,
        condition: template.condition,
        stories: template.stories,
        hasPool: template.hasPool ?? false,
        hasGarden: template.hasGarden ?? false,
        hasTerrace: template.hasTerrace ?? false,
        hasBalcony: template.hasBalcony ?? false,
        hasAirConditioning: template.hasAirConditioning ?? false,
        hasHeating: template.hasHeating ?? false,
        hasElevator: template.hasElevator ?? false,
        hasGym: template.hasGym ?? false,
        hasSecurity: template.hasSecurity ?? false,
        isFurnished: template.isFurnished ?? false,
        hasFireplace: template.hasFireplace ?? false,
        hasGrill: template.hasGrill ?? false,
        hasWaterTank: template.hasWaterTank ?? false,
        hasLaundryRoom: template.hasLaundryRoom ?? false,
        isFeatured: template.isFeatured,
        isPublished: true,
        publishedAt: new Date(),
        viewCount: Math.floor(Math.random() * 500),
        deleted: false,
      });

      // Create main price entry
      await this.propertyPriceRepository.create({
        propertyId: property.id,
        currency: template.currency,
        price: template.price,
        isMain: true,
      });

      // Create extra prices (multi-currency)
      if (template.extraPrices) {
        for (const ep of template.extraPrices) {
          await this.propertyPriceRepository.create({
            propertyId: property.id,
            currency: ep.currency,
            price: ep.price,
            isMain: false,
          });
        }
      }

      // Create images
      if (template.imageUrls) {
        for (let j = 0; j < template.imageUrls.length; j++) {
          await this.propertyImageRepository.create({
            propertyId: property.id,
            url: template.imageUrls[j],
            altText: `${template.title} - Imagen ${j + 1}`,
            order: j,
            isPrimary: j === 0,
          });
        }
      }

      count++;
      console.log(
        `[SeedProperties]   ✅ ${template.title} (${template.currency} ${template.price})`,
      );
    }

    return count;
  }

  // ── Helpers ─────────────────────────────────────────────────────────

  private buildLocationAssignments(locationIds: {
    countryIds: Map<string, string>;
    cityIds: Map<string, string>;
    neighborhoodIds: Map<string, string>;
  }) {
    const assignments: {
      countryId: string;
      cityId: string;
      neighborhoodId?: string;
    }[] = [];

    // Build concrete location tuples (country → city → neighborhood)
    for (const [countryCode, cities] of Object.entries(SEED_CITIES)) {
      const countryId = locationIds.countryIds.get(countryCode);
      if (!countryId) continue;

      for (const cityName of cities) {
        const cityId = locationIds.cityIds.get(cityName);
        if (!cityId) continue;

        const neighborhoods = SEED_NEIGHBORHOODS[cityName];
        if (neighborhoods && neighborhoods.length > 0) {
          // Pick a random neighborhood from this city
          const randomNeighborhood =
            neighborhoods[Math.floor(Math.random() * neighborhoods.length)];
          const neighborhoodId =
            locationIds.neighborhoodIds.get(randomNeighborhood);

          assignments.push({
            countryId,
            cityId,
            neighborhoodId: neighborhoodId ?? undefined,
          });
        } else {
          assignments.push({ countryId, cityId });
        }
      }
    }

    return assignments;
  }

  private generateSlug(title: string, index: number): string {
    const base = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    return `${base}-${index + 1}`;
  }
}
