import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class OrderProductDTO {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  product_price: number;
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  quantity: number;
}
