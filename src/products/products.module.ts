import { Module, forwardRef } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { CategoriesModule } from 'src/categories/categories.module';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    CategoriesModule,
    TypeOrmModule.forFeature([Product]),
    forwardRef(() => OrdersModule),
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
