export interface NeighborhoodProps {
  id: string;
  name: string;
  cityId: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Neighborhood {
  public readonly id: string;
  public readonly name: string;
  public readonly cityId: string;
  public readonly isActive: boolean;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(props: NeighborhoodProps) {
    Object.assign(this, props);
  }

  activate(): Neighborhood {
    return new Neighborhood({ ...this, isActive: true });
  }

  deactivate(): Neighborhood {
    return new Neighborhood({ ...this, isActive: false });
  }
}
