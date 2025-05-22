import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';

export class CreatePutawayDto {
  @IsNotEmpty()
  @IsString()
  receiptId: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;
}
