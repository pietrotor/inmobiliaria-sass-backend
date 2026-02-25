import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import {
  MediaRepository,
  MEDIA_REPOSITORY,
} from '@domain/media/repositories/media.repository';
import { MediaRole } from '@domain/media/value-objects/media-role.vo';
import { MediaType } from '@domain/media/value-objects/media-type.vo';
import {
  StorageService,
  STORAGE_SERVICE,
} from '@domain/common/services/storage.service';
import { UploadMediaDto } from '../dto/upload-media.dto';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

const SINGULAR_ROLES: MediaRole[] = [
  MediaRole.COVER,
  MediaRole.LOGO,
  MediaRole.AVATAR,
];

const IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const VIDEO_MIMES = ['video/mp4', 'video/webm', 'video/quicktime'];
const DOCUMENT_MIMES = ['application/pdf'];

function resolveMediaType(mimeType: string): MediaType {
  if (IMAGE_MIMES.includes(mimeType)) return MediaType.IMAGE;
  if (VIDEO_MIMES.includes(mimeType)) return MediaType.VIDEO;
  if (DOCUMENT_MIMES.includes(mimeType)) return MediaType.DOCUMENT;
  throw new BadRequestException(`Unsupported file type: ${mimeType}`);
}

@Injectable()
export class UploadMediaUseCase {
  constructor(
    @Inject(MEDIA_REPOSITORY)
    private readonly mediaRepository: MediaRepository,
    @Inject(STORAGE_SERVICE)
    private readonly storageService: StorageService,
  ) {}

  async execute(dto: UploadMediaDto, file: Express.Multer.File) {
    try {
      const mediaType = resolveMediaType(file.mimetype);

      if (SINGULAR_ROLES.includes(dto.role)) {
        const existing = await this.mediaRepository.findOneByEntityAndRole(
          dto.entityType,
          dto.entityId,
          dto.role,
        );

        if (existing) {
          await this.storageService.deleteFile(existing.key);
          await this.mediaRepository.delete(existing.id);
        }
      }

      const key = this.storageService.generateKey({
        context: dto.entityType.toLowerCase() + 's',
        entityId: dto.entityId,
        filename: file.originalname,
        subfolder: dto.role.toLowerCase(),
      });

      const url = await this.storageService.uploadFile({
        buffer: file.buffer,
        key,
        contentType: file.mimetype,
      });

      const created = await this.mediaRepository.create({
        entityType: dto.entityType,
        entityId: dto.entityId,
        mediaType,
        role: dto.role,
        url,
        key,
        filename: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        sortOrder: dto.sortOrder ?? 0,
      });

      return created;
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'UploadMediaUseCase');
    }
  }
}
