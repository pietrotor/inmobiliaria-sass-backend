export interface CountryProps {
  id: string;
  name: string;
  code: string; // ISO 3166-1 alpha-2 (e.g. "VE", "US", "AR")
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Country {
  public readonly id: string;
  public readonly name: string;
  public readonly code: string;
  public readonly isActive: boolean;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(props: CountryProps) {
    Object.assign(this, props);
  }

  activate(): Country {
    return new Country({ ...this, isActive: true });
  }

  deactivate(): Country {
    return new Country({ ...this, isActive: false });
  }
}
