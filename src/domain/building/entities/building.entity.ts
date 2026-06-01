export interface BuildingProps {
  id: string;
  projectId: string;
  name: string;
  totalFloors: number;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Building {
  public readonly id: string;
  public readonly projectId: string;
  public readonly name: string;
  public readonly totalFloors: number;
  public readonly sortOrder: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: BuildingProps) {
    this.id = props.id;
    this.projectId = props.projectId;
    this.name = props.name;
    this.totalFloors = props.totalFloors;
    this.sortOrder = props.sortOrder;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  updateInfo(
    data: Partial<Omit<BuildingProps, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>>,
  ): Building {
    return new Building({ ...this, ...data });
  }
}
