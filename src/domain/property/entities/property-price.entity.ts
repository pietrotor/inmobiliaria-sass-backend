import { Currency } from '../value-objects/currency.vo';

export interface PropertyPriceProps {
  id: string;
  propertyId: string;
  currency: Currency;
  price: number;
  isMain: boolean;
  createdAt?: Date;
}

export class PropertyPrice {
  public readonly id: string;
  public readonly propertyId: string;
  public readonly currency: Currency;
  public readonly price: number;
  public readonly isMain: boolean;
  public readonly createdAt?: Date;

  constructor(props: PropertyPriceProps) {
    Object.assign(this, props);
  }

  /** Mark this price as the main/primary one */
  markAsMain(): PropertyPrice {
    return new PropertyPrice({
      ...this,
      isMain: true,
    });
  }

  /** Unmark as main */
  unmarkMain(): PropertyPrice {
    return new PropertyPrice({
      ...this,
      isMain: false,
    });
  }

  /** Update the price amount */
  updatePrice(newPrice: number): PropertyPrice {
    return new PropertyPrice({
      ...this,
      price: newPrice,
    });
  }
}
