export interface PropertyImageProps {
  id: string;
  propertyId: string;
  url: string;
  altText?: string;
  order: number;
  isPrimary: boolean;
  createdAt?: Date;
}

export class PropertyImage {
  public readonly id: string;
  public readonly propertyId: string;
  public readonly url: string;
  public readonly altText?: string;
  public readonly order: number;
  public readonly isPrimary: boolean;
  public readonly createdAt?: Date;

  constructor(props: PropertyImageProps) {
    Object.assign(this, props);
  }

  /** Mark this image as the primary one */
  markAsPrimary(): PropertyImage {
    return new PropertyImage({
      ...this,
      isPrimary: true,
    });
  }

  /** Unmark as primary */
  unmarkPrimary(): PropertyImage {
    return new PropertyImage({
      ...this,
      isPrimary: false,
    });
  }

  /** Update sort order */
  reorder(newOrder: number): PropertyImage {
    return new PropertyImage({
      ...this,
      order: newOrder,
    });
  }
}
