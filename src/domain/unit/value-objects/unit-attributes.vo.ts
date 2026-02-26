import { Orientation } from './orientation.vo';

export interface HabitableUnitAttributes {
  type: 'APARTMENT' | 'OFFICE' | 'COMMERCIAL';
  floor: number;
  sqm: number;
  sqmUsable: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  halfBathrooms: number | null;
  orientation: Orientation | null;
  hasBalcony: boolean;
  hasLaundryRoom: boolean;
  hasServantRoom: boolean;
}

export interface ParkingAttributes {
  type: 'PARKING';
  level: string;
  spotNumber: string;
  isCovered: boolean;
  sqm: number | null;
}

export interface StorageAttributes {
  type: 'STORAGE';
  level: string | null;
  sqm: number | null;
}

export type UnitAttributes =
  | HabitableUnitAttributes
  | ParkingAttributes
  | StorageAttributes;
