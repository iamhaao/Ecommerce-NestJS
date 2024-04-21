import { Module, forwardRef } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Shipping } from './entities/shipping.entity';
import { OrdersProducts } from './entities/orders-products.entity';
import { ProductsModule } from 'src/products/products.module';
import { ProductsService } from 'src/products/products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Shipping, OrdersProducts]),
    forwardRef(() => ProductsModule),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
