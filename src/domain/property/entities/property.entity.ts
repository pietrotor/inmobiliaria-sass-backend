import { PropertyType } from '../value-objects/property-type.vo';
import { TransactionType } from '../value-objects/transaction-type.vo';
import { PropertyStatus } from '../value-objects/property-status.vo';
import { Currency } from '../value-objects/currency.vo';
import { PropertyCondition } from '../value-objects/property-condition.vo';

export interface PropertyProps {
  id: string;
  organizationId: string;

  // Basic info
  title: string;
  slug: string;
  propertyType: PropertyType;
  transactionType: TransactionType;
  status: PropertyStatus;
  internalCode?: string;

  // Pricing
  currency: Currency;
  price: number;
  previousPrice?: number;
  maintenanceFee?: number;
  pricePerSqm?: number;

  // Descriptions
  description?: string;
  shortDescription?: string;
  privateNotes?: string;

  // Location
  country?: string;
  state?: string;
  city?: string;
  neighborhood?: string;
  address?: string;
  streetNumber?: string;
  floor?: string;
  apartment?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;

  // Physical characteristics
  totalArea?: number;
  coveredArea?: number;
  landArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  halfBathrooms?: number;
  garages?: number;
  parkingSpaces?: number;
  stories?: number;
  yearBuilt?: number;
  condition?: PropertyCondition;
  orientation?: string;
  disposition?: string;

  // Amenities / features
  hasPool?: boolean;
  hasGarden?: boolean;
  hasTerrace?: boolean;
  hasBalcony?: boolean;
  hasAirConditioning?: boolean;
  hasHeating?: boolean;
  hasCentralHeating?: boolean;
  hasFireplace?: boolean;
  hasClosets?: boolean;
  hasLaundryRoom?: boolean;
  hasSecurity?: boolean;
  hasElevator?: boolean;
  hasGym?: boolean;
  hasPetsAllowed?: boolean;
  isFurnished?: boolean;
  hasRooftop?: boolean;
  hasGrill?: boolean;
  hasSolarPanels?: boolean;
  hasWaterTank?: boolean;
  hasServiceRoom?: boolean;

  // SEO & web
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  videoUrl?: string;
  virtualTourUrl?: string;

  // Contact / agent
  agentId?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactWhatsapp?: string;

  // Control
  isFeatured: boolean;
  isPublished: boolean;
  publishedAt?: Date;
  expiresAt?: Date;
  viewCount: number;

  // Audit
  deleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Property {
  public readonly id: string;
  public readonly organizationId: string;

  // Basic info
  public readonly title: string;
  public readonly slug: string;
  public readonly propertyType: PropertyType;
  public readonly transactionType: TransactionType;
  public readonly status: PropertyStatus;
  public readonly internalCode?: string;

  // Pricing
  public readonly currency: Currency;
  public readonly price: number;
  public readonly previousPrice?: number;
  public readonly maintenanceFee?: number;
  public readonly pricePerSqm?: number;

  // Descriptions
  public readonly description?: string;
  public readonly shortDescription?: string;
  public readonly privateNotes?: string;

  // Location
  public readonly country?: string;
  public readonly state?: string;
  public readonly city?: string;
  public readonly neighborhood?: string;
  public readonly address?: string;
  public readonly streetNumber?: string;
  public readonly floor?: string;
  public readonly apartment?: string;
  public readonly zipCode?: string;
  public readonly latitude?: number;
  public readonly longitude?: number;

  // Physical characteristics
  public readonly totalArea?: number;
  public readonly coveredArea?: number;
  public readonly landArea?: number;
  public readonly bedrooms?: number;
  public readonly bathrooms?: number;
  public readonly halfBathrooms?: number;
  public readonly garages?: number;
  public readonly parkingSpaces?: number;
  public readonly stories?: number;
  public readonly yearBuilt?: number;
  public readonly condition?: PropertyCondition;
  public readonly orientation?: string;
  public readonly disposition?: string;

  // Amenities / features
  public readonly hasPool?: boolean;
  public readonly hasGarden?: boolean;
  public readonly hasTerrace?: boolean;
  public readonly hasBalcony?: boolean;
  public readonly hasAirConditioning?: boolean;
  public readonly hasHeating?: boolean;
  public readonly hasCentralHeating?: boolean;
  public readonly hasFireplace?: boolean;
  public readonly hasClosets?: boolean;
  public readonly hasLaundryRoom?: boolean;
  public readonly hasSecurity?: boolean;
  public readonly hasElevator?: boolean;
  public readonly hasGym?: boolean;
  public readonly hasPetsAllowed?: boolean;
  public readonly isFurnished?: boolean;
  public readonly hasRooftop?: boolean;
  public readonly hasGrill?: boolean;
  public readonly hasSolarPanels?: boolean;
  public readonly hasWaterTank?: boolean;
  public readonly hasServiceRoom?: boolean;

  // SEO & web
  public readonly metaTitle?: string;
  public readonly metaDescription?: string;
  public readonly keywords?: string[];
  public readonly videoUrl?: string;
  public readonly virtualTourUrl?: string;

  // Contact / agent
  public readonly agentId?: string;
  public readonly contactPhone?: string;
  public readonly contactEmail?: string;
  public readonly contactWhatsapp?: string;

  // Control
  public readonly isFeatured: boolean;
  public readonly isPublished: boolean;
  public readonly publishedAt?: Date;
  public readonly expiresAt?: Date;
  public readonly viewCount: number;

  // Audit
  public readonly deleted: boolean;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(props: PropertyProps) {
    Object.assign(this, props);
  }

  // ── Business logic methods ────────────────────────────────────────

  /** Check if the property is available for showing */
  isAvailable(): boolean {
    return (
      this.isPublished &&
      !this.deleted &&
      [PropertyStatus.ACTIVE].includes(this.status)
    );
  }

  /** Check if the property is for sale */
  isForSale(): boolean {
    return this.transactionType === TransactionType.SALE;
  }

  /** Check if the property is for rent */
  isForRent(): boolean {
    return (
      this.transactionType === TransactionType.RENT ||
      this.transactionType === TransactionType.TEMPORARY_RENT
    );
  }

  /** Check if listing has expired */
  isExpired(): boolean {
    if (!this.expiresAt) return false;
    return new Date() > this.expiresAt;
  }

  /** Publish the property */
  publish(): Property {
    return new Property({
      ...this,
      isPublished: true,
      status: PropertyStatus.ACTIVE,
      publishedAt: new Date(),
    });
  }

  /** Unpublish / pause the property */
  pause(): Property {
    return new Property({
      ...this,
      status: PropertyStatus.PAUSED,
    });
  }

  /** Mark as sold */
  markAsSold(): Property {
    return new Property({
      ...this,
      status: PropertyStatus.SOLD,
      isPublished: false,
    });
  }

  /** Mark as rented */
  markAsRented(): Property {
    return new Property({
      ...this,
      status: PropertyStatus.RENTED,
      isPublished: false,
    });
  }

  /** Mark as reserved */
  reserve(): Property {
    return new Property({
      ...this,
      status: PropertyStatus.RESERVED,
    });
  }

  /** Soft-delete the property */
  softDelete(): Property {
    return new Property({
      ...this,
      deleted: true,
      isPublished: false,
    });
  }

  /** Toggle featured flag */
  toggleFeatured(): Property {
    return new Property({
      ...this,
      isFeatured: !this.isFeatured,
    });
  }

  /** Increment view count */
  incrementViews(): Property {
    return new Property({
      ...this,
      viewCount: this.viewCount + 1,
    });
  }

  /** Update property info */
  updateInfo(data: Partial<PropertyProps>): Property {
    return new Property({
      ...this,
      ...data,
    });
  }
}
