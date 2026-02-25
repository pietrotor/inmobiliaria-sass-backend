import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateDeveloperDto } from './create-developer.dto';

export class UpdateDeveloperDto extends PartialType(
  OmitType(CreateDeveloperDto, ['organizationId'] as const),
) {}
