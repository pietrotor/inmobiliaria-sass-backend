import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

import {
  AiSearchParserService,
  LocationContext,
  ParsedPropertyFilters,
} from '@domain/common/services/ai-search-parser.service';

@Injectable()
export class OpenAiSearchParserService implements AiSearchParserService {
  private readonly client: OpenAI;
  private readonly logger = new Logger(OpenAiSearchParserService.name);
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.configService.getOrThrow<string>('OPENAI_API_KEY'),
    });
    this.model = this.configService.get<string>('OPENAI_MODEL', 'gpt-4o-mini');
  }

  async parseSearchQuery(
    query: string,
    locationContext: LocationContext,
  ): Promise<ParsedPropertyFilters> {
    const systemPrompt = this.buildSystemPrompt(locationContext);

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        temperature: 0,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query },
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'search_properties',
              description:
                'Parses a natural language property search query into structured filters for database querying.',
              parameters: {
                type: 'object',
                properties: {
                  propertyType: {
                    type: 'string',
                    enum: [
                      'HOUSE',
                      'APARTMENT',
                      'LAND',
                      'COMMERCIAL',
                      'OFFICE',
                      'WAREHOUSE',
                      'GARAGE',
                      'BUILDING',
                      'COUNTRY_HOUSE',
                      'FARM',
                      'STUDIO',
                      'PENTHOUSE',
                      'DUPLEX',
                      'TRIPLEX',
                      'LOFT',
                      'OTHER',
                    ],
                    description:
                      'Type of property. Map: apartamento/depto/piso=APARTMENT, casa=HOUSE, terreno/lote=LAND, local/comercial=COMMERCIAL, oficina=OFFICE, galpón/depósito=WAREHOUSE, garage/cochera=GARAGE, edificio=BUILDING, quinta/cabaña=COUNTRY_HOUSE, finca/campo=FARM, estudio/monoambiente=STUDIO, penthouse/ático=PENTHOUSE, dúplex=DUPLEX, tríplex=TRIPLEX, loft=LOFT.',
                  },
                  transactionType: {
                    type: 'string',
                    enum: ['SALE', 'RENT', 'TEMPORARY_RENT'],
                    description:
                      'Transaction type. Map: venta/compra/comprar/vender=SALE, alquiler/renta/arrendar=RENT, alquiler temporal/alquiler vacacional/temporario=TEMPORARY_RENT. Default to SALE if the user says "quiero" or just mentions a property without specifying.',
                  },
                  currency: {
                    type: 'string',
                    enum: [
                      'USD',
                      'VES',
                      'ARS',
                      'EUR',
                      'BRL',
                      'CLP',
                      'COP',
                      'MXN',
                      'PEN',
                      'UYU',
                    ],
                    description:
                      'Currency. Map: dólares/dollars/usd=USD, bolívares/bs=VES, pesos argentinos=ARS, euros=EUR, reales=BRL, pesos chilenos=CLP, pesos colombianos=COP, pesos mexicanos=MXN, soles=PEN, pesos uruguayos=UYU. Default to USD if the user mentions a price without currency.',
                  },
                  minPrice: {
                    type: 'number',
                    description:
                      'Minimum price. Parse: "más de 100mil" → 100000, "desde 50k" → 50000, "entre 80 y 120 mil" → 80000.',
                  },
                  maxPrice: {
                    type: 'number',
                    description:
                      'Maximum price. Parse: "menos de 100mil" → 100000, "hasta 200k" → 200000, "entre 80 y 120 mil" → 120000, "barato" → contextual.',
                  },
                  countryId: {
                    type: 'string',
                    description:
                      'UUID of the country from the available locations. Match country names or codes from the context provided.',
                  },
                  cityId: {
                    type: 'string',
                    description:
                      'UUID of the city from the available locations. Match city names from the context provided.',
                  },
                  neighborhoodId: {
                    type: 'string',
                    description:
                      'UUID of the neighborhood from the available locations. Match neighborhood names from the context provided.',
                  },
                  bedrooms: {
                    type: 'integer',
                    description:
                      'Minimum number of bedrooms. Parse: "2 cuartos/habitaciones/dormitorios" → 2, "3 ambientes" → 2 (ambientes-1 for bedrooms).',
                  },
                  bathrooms: {
                    type: 'integer',
                    description:
                      'Minimum number of bathrooms. Parse: "2 baños" → 2.',
                  },
                  minTotalArea: {
                    type: 'number',
                    description:
                      'Minimum total area in m². Parse: "más de 100m2/metros" → 100.',
                  },
                  maxTotalArea: {
                    type: 'number',
                    description:
                      'Maximum total area in m². Parse: "menos de 200m2/metros" → 200.',
                  },
                  isFeatured: {
                    type: 'boolean',
                    description:
                      'Only featured properties. Set true if user says "destacado/featured/premium".',
                  },
                  sortBy: {
                    type: 'string',
                    enum: [
                      'price',
                      'title',
                      'bedrooms',
                      'totalArea',
                      'viewCount',
                      'publishedAt',
                      'createdAt',
                    ],
                    description:
                      'Sort field. Map: "más barato/económico" → price (asc), "más caro" → price (desc), "más nuevo/reciente" → createdAt (desc), "más grande" → totalArea (desc), "más popular/visto" → viewCount (desc).',
                  },
                  sortOrder: {
                    type: 'string',
                    enum: ['asc', 'desc'],
                    description: 'Sort direction. Default desc.',
                  },
                },
                required: [],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: {
          type: 'function',
          function: { name: 'search_properties' },
        },
      });

      const toolCall = response.choices[0]?.message?.tool_calls?.[0];

      if (
        !toolCall ||
        toolCall.type !== 'function' ||
        toolCall.function.name !== 'search_properties'
      ) {
        this.logger.warn(
          'OpenAI did not return expected function call, returning empty filters',
        );
        return {};
      }

      const parsed: ParsedPropertyFilters = JSON.parse(
        toolCall.function.arguments,
      );

      this.logger.log(
        `Parsed query "${query}" → ${JSON.stringify(parsed)}`,
      );

      return parsed;
    } catch (error) {
      this.logger.error(`Failed to parse search query: ${error.message}`);
      throw error;
    }
  }

  private buildSystemPrompt(locationContext: LocationContext): string {
    const countriesList = locationContext.countries
      .map((c) => `  - "${c.name}" (code: ${c.code}, id: ${c.id})`)
      .join('\n');

    const citiesList = locationContext.cities
      .map((c) => {
        const country = locationContext.countries.find(
          (co) => co.id === c.countryId,
        );
        return `  - "${c.name}" (country: ${country?.name || 'N/A'}, id: ${c.id})`;
      })
      .join('\n');

    const neighborhoodsList = locationContext.neighborhoods
      .map((n) => {
        const city = locationContext.cities.find((c) => c.id === n.cityId);
        return `  - "${n.name}" (city: ${city?.name || 'N/A'}, id: ${n.id})`;
      })
      .join('\n');

    return `You are a search query parser for a Latin American real estate platform.
Your job is to extract structured filters from natural language property search queries.
Users will write in Spanish (primarily), Portuguese, or English.

IMPORTANT RULES:
- Only set filters that you can confidently extract from the query. If unsure, omit the field.
- For locations, ONLY use IDs from the available locations listed below. If a location mentioned doesn't match any available option, omit it.
- Handle abbreviations and slang: "depto" = apartment, "cuartos" = bedrooms, "100k" = 100000, "100mil" = 100000.
- "ambientes" is an Argentine term: 3 ambientes = 2 bedrooms (ambientes - 1).
- If the user mentions a price but no currency, default to USD.
- If the user says "quiero un apartamento" without specifying sale/rent, default to SALE.
- For price parsing: "barato" → maxPrice=100000, "caro" or "lujoso" → minPrice=300000 (contextual).

AVAILABLE LOCATIONS:

Countries:
${countriesList || '  (none registered)'}

Cities:
${citiesList || '  (none registered)'}

Neighborhoods:
${neighborhoodsList || '  (none registered)'}

Call the search_properties function with the extracted filters.`;
  }
}
