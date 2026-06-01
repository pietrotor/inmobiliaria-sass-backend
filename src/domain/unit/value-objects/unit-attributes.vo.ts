import { Orientation } from './orientation.vo';

interface WithCustomTags {
  /**
   * Free-form features that describe the unit/typology — every distinctive
   * trait (amenities, finishes, perks) lives here as a short label. There is
   * no fixed catalog: developers add whatever applies (e.g. "Balcón",
   * "Parrillero", "Dormitorio con suite", "Vista panorámica", "Sala de eventos
   * exclusiva"). In a resolved unit, tags are the union (without duplicates)
   * of the typology's customTags and the unit's own customTags overrides.
   */
  customTags: string[];
}

export interface HabitableUnitAttributes extends WithCustomTags {
  type: 'APARTMENT' | 'OFFICE' | 'COMMERCIAL';
  floor: number;
  sqm: number;
  sqmUsable: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  halfBathrooms: number | null;
  orientation: Orientation | null;
}

export interface ParkingAttributes extends WithCustomTags {
  type: 'PARKING';
  level: string;
  spotNumber: string;
  isCovered: boolean;
  sqm: number | null;
}

export interface StorageAttributes extends WithCustomTags {
  type: 'STORAGE';
  level: string | null;
  sqm: number | null;
}

export interface HouseAttributes extends WithCustomTags {
  type: 'HOUSE';
  lotNumber: string;
  lotAreaSqm: number;
  builtAreaSqm: number;
  floors: number;
  bedrooms: number | null;
  bathrooms: number | null;
  halfBathrooms: number | null;
  hasGarden: boolean;
  hasGarage: boolean;
  hasTerrace: boolean;
  orientation: Orientation | null;
}

export interface TownhouseAttributes extends WithCustomTags {
  type: 'TOWNHOUSE';
  lotNumber: string;
  lotAreaSqm: number;
  builtAreaSqm: number;
  floors: number;
  bedrooms: number | null;
  bathrooms: number | null;
  halfBathrooms: number | null;
  position: 'CORNER' | 'MIDDLE' | 'END';
  hasGarden: boolean;
  hasGarage: boolean;
  hasTerrace: boolean;
  orientation: Orientation | null;
}

export interface LotAttributes extends WithCustomTags {
  type: 'LOT';
  lotNumber: string;
  areaSqm: number;
  frontMeters: number | null;
  orientation: Orientation | null;
}

export type UnitAttributes =
  | HabitableUnitAttributes
  | ParkingAttributes
  | StorageAttributes
  | HouseAttributes
  | TownhouseAttributes
  | LotAttributes;
