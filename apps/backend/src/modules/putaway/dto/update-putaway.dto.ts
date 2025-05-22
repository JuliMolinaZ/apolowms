import { PartialType } from '@nestjs/mapped-types';
import { CreatePutawayDto } from './create-putaway.dto';

export class UpdatePutawayDto extends PartialType(CreatePutawayDto) {}
