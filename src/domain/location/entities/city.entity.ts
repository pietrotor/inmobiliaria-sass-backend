export interface CityProps {
  id: string;
  name: string;
  countryId: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class City {
  public readonly id: string;
  public readonly name: string;
  public readonly countryId: string;
  public readonly isActive: boolean;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(props: CityProps) {
    Object.assign(this, props);
  }

  activate(): City {
    return new City({ ...this, isActive: true });
  }

  deactivate(): City {
    return new City({ ...this, isActive: false });
  }
}
