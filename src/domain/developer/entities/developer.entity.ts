export interface DeveloperProps {
  id: string;
  organizationId: string;
  name: string;
  legalName: string;
  taxId: string;
  phone: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Developer {
  public readonly id: string;
  public readonly organizationId: string;
  public readonly name: string;
  public readonly legalName: string;
  public readonly taxId: string;
  public readonly phone: string;
  public readonly email: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: DeveloperProps) {
    this.id = props.id;
    this.organizationId = props.organizationId;
    this.name = props.name;
    this.legalName = props.legalName;
    this.taxId = props.taxId;
    this.phone = props.phone;
    this.email = props.email;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  updateInfo(
    data: Partial<
      Omit<DeveloperProps, 'id' | 'organizationId' | 'createdAt' | 'updatedAt'>
    >,
  ): Developer {
    return new Developer({
      ...this,
      ...data,
    });
  }
}
