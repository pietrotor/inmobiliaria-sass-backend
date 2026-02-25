import { Project } from '@domain/project/entities/project.entity';
import { Media } from '@domain/media/entities/media.entity';
import { MediaRepository } from '@domain/media/repositories/media.repository';
import { EntityType } from '@domain/media/value-objects/entity-type.vo';
import { MediaRole } from '@domain/media/value-objects/media-role.vo';

export type ProjectWithMedia = Project & {
  coverImage: Media | null;
  media: Media[];
};

export async function enrichProjectWithMedia(
  mediaRepository: MediaRepository,
  project: Project,
): Promise<ProjectWithMedia> {
  const media = await mediaRepository.findByEntity(
    EntityType.PROJECT,
    project.id,
  );
  const coverImage = media.find((m) => m.role === MediaRole.COVER) ?? null;
  return Object.assign(project, { coverImage, media });
}

export async function enrichProjectsWithMedia(
  mediaRepository: MediaRepository,
  projects: Project[],
): Promise<ProjectWithMedia[]> {
  return Promise.all(
    projects.map((project) => enrichProjectWithMedia(mediaRepository, project)),
  );
}
