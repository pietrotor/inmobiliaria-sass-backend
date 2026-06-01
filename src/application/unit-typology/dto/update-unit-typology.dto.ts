import { PartialType } from '@nestjs/swagger';
import { CreateUnitTypologyDto } from './create-unit-typology.dto';

export class UpdateUnitTypologyDto extends PartialType(CreateUnitTypologyDto) {}
