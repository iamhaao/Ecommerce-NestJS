import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;
  @IsNotEmpty()
  @IsNumber()
  rating: number;
  @IsNotEmpty()
  @IsString()
  comment: string;
}
