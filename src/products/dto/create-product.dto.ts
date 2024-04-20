import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Title can not be blank' })
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  stock: number;
  @IsNotEmpty({})
  @IsArray()
  images: string[];
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;
}
