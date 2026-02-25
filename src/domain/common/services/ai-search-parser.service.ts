export const AI_SEARCH_PARSER = 'AI_SEARCH_PARSER';

export interface LocationContext {
  countries: { id: string; name: string; code: string }[];
  cities: { id: string; name: string; countryId: string }[];
  neighborhoods: { id: string; name: string; cityId: string }[];
}

export interface ParsedPropertyFilters {
  propertyType?: string;
  transactionType?: string;
  status?: string;
  currency?: string;
  minPrice?: number;
  maxPrice?: number;
  countryId?: string;
  cityId?: string;
  neighborhoodId?: string;
  bedrooms?: number;
  bathrooms?: number;
  minTotalArea?: number;
  maxTotalArea?: number;
  isFeatured?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AiSearchParserService {
  parseSearchQuery(
    query: string,
    locationContext: LocationContext,
  ): Promise<ParsedPropertyFilters>;
}
