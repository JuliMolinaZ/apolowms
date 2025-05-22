import { PartialType } from '@nestjs/mapped-types';
import { CreatePickingDto } from './create-picking.dto';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdatePickingDto extends PartialType(CreatePickingDto) {}
