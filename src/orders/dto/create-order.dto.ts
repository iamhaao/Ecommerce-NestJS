import { Type } from 'class-transformer';
import { CreateShippingDTO } from './create-shipping.dto';
import { ValidateNested } from 'class-validator';
import { OrderProductDTO } from './order-product.dto';

export class CreateOrderDto {
  @Type(() => CreateShippingDTO)
  @ValidateNested()
  shippingInformation: CreateShippingDTO;

  @Type(() => OrderProductDTO)
  @ValidateNested()
  orderedProducts: OrderProductDTO[];
}
