import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserCurrent } from 'src/utility/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Order } from './entities/order.entity';
import { Roles } from 'src/utility/decorators/authorize-roles.decorator';
import { Role } from 'src/utility/common/user-role.enum';
import { UpdateOrderStatusDTO } from './dto/update-order-status.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @UserCurrent() currentUser: User,
  ): Promise<Order> {
    return await this.ordersService.create(createOrderDto, currentUser);
  }

  @Get()
  async findAll(): Promise<Order[]> {
    return await this.ordersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Order> {
    return await this.ordersService.findOne(+id);
  }

  @Roles(Role.ADMIN)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderStatusDTO: UpdateOrderStatusDTO,
    @UserCurrent() currentUser: User,
  ) {
    return await this.ordersService.update(
      +id,
      updateOrderStatusDTO,
      currentUser,
    );
  }
  @Roles(Role.ADMIN, Role.USER)
  @Put('cancel/:id')
  async cancelOrder(@Param('id') id: string, @UserCurrent() currentUser: User) {
    return await this.ordersService.cancelOrder(+id, currentUser);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
