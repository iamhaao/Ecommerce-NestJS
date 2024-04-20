import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { OrderStatus } from '../enums/oder-status.enum';

export class UpdateOrderStatusDTO {
  @IsString()
  @IsNotEmpty()
  @IsIn([
    OrderStatus.DELIVERED,
    OrderStatus.PROCESSING,
    OrderStatus.SHIPPING,
    OrderStatus.CANCEL,
  ])
  status: OrderStatus;
}
