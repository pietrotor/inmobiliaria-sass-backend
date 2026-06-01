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

/**
 * MIME types blocked for safety. Executables and shell scripts are rejected
 * regardless of the role to avoid serving malware from public S3 URLs.
 */
const BLOCKED_MIMES = new Set<string>([
  'application/x-msdownload',
  'application/x-executable',
  'application/x-dosexec',
  'application/x-msdos-program',
  'application/x-sh',
  'application/x-shellscript',
  'application/x-bat',
  'application/bat',
  'application/x-msi',
]);

/**
 * Classifies a MIME type into one of the three coarse `MediaType` buckets used
 * for UI grouping. Anything that is not image/* or video/* falls into
 * DOCUMENT, which is intentional: developers should be able to upload plans,
 * brochures, technical specs, CAD files, archives, etc.
 */
function resolveMediaType(mimeType: string): MediaType {
  if (BLOCKED_MIMES.has(mimeType)) {
    throw new BadRequestException(
      `File type '${mimeType}' is not allowed for security reasons`,
    );
  }
  if (mimeType.startsWith('image/')) return MediaType.IMAGE;
  if (mimeType.startsWith('video/')) return MediaType.VIDEO;
  return MediaType.DOCUMENT;
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
