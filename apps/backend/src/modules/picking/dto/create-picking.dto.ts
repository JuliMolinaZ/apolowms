import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';

export class CreatePickingDto {
  @IsNotEmpty()
  @IsString()
  orderNumber: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;
}
