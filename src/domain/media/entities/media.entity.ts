import { EntityType } from '../value-objects/entity-type.vo';
import { MediaType } from '../value-objects/media-type.vo';
import { MediaRole } from '../value-objects/media-role.vo';

export interface MediaProps {
  id: string;
  entityType: EntityType;
  entityId: string;
  mediaType: MediaType;
  role: MediaRole;
  url: string;
  key: string;
  filename: string;
  mimeType: string;
  size: number;
  sortOrder: number;
  createdAt: Date;
}

export class Media {
  public readonly id: string;
  public readonly entityType: EntityType;
  public readonly entityId: string;
  public readonly mediaType: MediaType;
  public readonly role: MediaRole;
  public readonly url: string;
  public readonly key: string;
  public readonly filename: string;
  public readonly mimeType: string;
  public readonly size: number;
  public readonly sortOrder: number;
  public readonly createdAt: Date;

  constructor(props: MediaProps) {
    this.id = props.id;
    this.entityType = props.entityType;
    this.entityId = props.entityId;
    this.mediaType = props.mediaType;
    this.role = props.role;
    this.url = props.url;
    this.key = props.key;
    this.filename = props.filename;
    this.mimeType = props.mimeType;
    this.size = props.size;
    this.sortOrder = props.sortOrder;
    this.createdAt = props.createdAt;
  }

  isCover(): boolean {
    return this.role === MediaRole.COVER;
  }

  isImage(): boolean {
    return this.mediaType === MediaType.IMAGE;
  }
}
