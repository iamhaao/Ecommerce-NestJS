import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateShippingDTO {
  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  address: string;
  @IsNotEmpty()
  @IsString()
  city: string;
  @IsNotEmpty()
  @IsString()
  state: string;
}
