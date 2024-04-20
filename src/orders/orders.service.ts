import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrdersProducts } from './entities/orders-products.entity';
import { Shipping } from './entities/shipping.entity';
import { Product } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import { UpdateOrderStatusDTO } from './dto/update-order-status.dto';
import { OrderStatus } from './enums/oder-status.enum';
import { Role } from 'src/utility/common/user-role.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrdersProducts)
    private readonly orderProductRepository: Repository<OrdersProducts>,
    private readonly prorductService: ProductsService,
  ) {}
  async create(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    const shippingEntity = new Shipping();
    Object.assign(shippingEntity, createOrderDto.shippingInformation);

    const orderEntity = new Order();
    orderEntity.shippingInformation = shippingEntity;
    orderEntity.orderedBy = user;
    const orderSave = await this.orderRepository.save(orderEntity);

    let opEntity: {
      order: Order;
      product: Product;
      product_price: number;
      quantity: number;
    }[] = [];

    for (let i = 0; i < createOrderDto.orderedProducts.length; i++) {
      const order = orderSave;
      const product = await this.prorductService.findOne(
        createOrderDto.orderedProducts[i].productId,
      );
      const quantity = createOrderDto.orderedProducts[i].quantity;
      const product_price = createOrderDto.orderedProducts[i].product_price;
      opEntity.push({ order, product, product_price, quantity });
    }

    await this.orderProductRepository.insert(opEntity);

    return await this.findOne(orderSave.id);
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: {
        shippingInformation: true,
        orderedBy: true,
        orderedProducts: {
          product: true,
        },
      },
    });
  }

  async findOne(id: number): Promise<Order> {
    return await this.orderRepository.findOne({
      where: { id },
      relations: {
        shippingInformation: true,
        orderedBy: true,
        orderedProducts: {
          product: true,
        },
      },
    });
  }

  async update(
    id: number,
    updateOrderStatusDTO: UpdateOrderStatusDTO,
    user: User,
  ) {
    let order = await this.findOne(id);
    if (!order) throw new NotFoundException('Order not found');
    if (
      order.status === OrderStatus.DELIVERED ||
      order.status === OrderStatus.CANCEL
    ) {
      throw new BadRequestException(`Order already ${order.status}`);
    }
    if (
      order.status === OrderStatus.PROCESSING &&
      updateOrderStatusDTO.status === OrderStatus.DELIVERED
    ) {
      throw new BadRequestException(`Delivery before shipping !!!`);
    }
    if (
      order.status === OrderStatus.SHIPPING &&
      updateOrderStatusDTO.status === OrderStatus.SHIPPING
    ) {
      return order;
    }
    if (updateOrderStatusDTO.status === OrderStatus.SHIPPING) {
      order.shippedAt = new Date();
    }
    if (updateOrderStatusDTO.status === OrderStatus.DELIVERED) {
      order.deliveredAt = new Date();
    }

    if (updateOrderStatusDTO.status === OrderStatus.SHIPPING) {
      await this.stockUpdate(order, OrderStatus.SHIPPING);
    }
    order.status = updateOrderStatusDTO.status;
    order = await this.orderRepository.save(order);

    return order;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async stockUpdate(order: Order, status: string) {
    for (const op of order.orderedProducts) {
      await this.prorductService.updateStock(
        op.product.id,
        op.quantity,
        status,
      );
    }
  }
  async cancelOrder(id: number, user: User): Promise<Order> {
    let order = await this.findOne(id);
    if (!order) throw new NotFoundException('Order not found');
    const isAdmin = user.roles.some((role) => role.name === Role.ADMIN);

    if (user.id !== order.orderedBy.id || !isAdmin)
      throw new BadRequestException('You not allow cancel this order');

    if (order.status === OrderStatus.CANCEL) {
      return order;
    }
    if (order.status === OrderStatus.DELIVERED) {
      throw new BadRequestException('Order Delivered you, cannot cancel!');
    }
    order.status = OrderStatus.CANCEL;
    order = await this.orderRepository.save(order);
    await this.stockUpdate(order, OrderStatus.CANCEL);
    return order;
  }
}
