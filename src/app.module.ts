import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { CurrentUserMiddleware } from './utility/middleware/current-user.middleware';
import { RoleEntity } from './users/entities/role.entity';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/entities/category.entity';
import { AuthenticationGuard } from './utility/guards/authentication.guard';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { AuthorizationGuard } from './utility/guards/authorization.guard';
import { ProductsModule } from './products/products.module';
import { Product } from './products/entities/product.entity';
import { ReviewsModule } from './reviews/reviews.module';
import { Review } from './reviews/entities/review.entity';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/order.entity';
import { Shipping } from './orders/entities/shipping.entity';
import { OrdersProducts } from './orders/entities/orders-products.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'lehao1911',
      database: 'bazarapi',
      entities: [
        User,
        RoleEntity,
        Category,
        Product,
        Review,
        Order,
        Shipping,
        OrdersProducts,
      ],
      synchronize: true,
    }),
    UsersModule,
    CategoriesModule,
    ProductsModule,
    ReviewsModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
    Reflector,
  ],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
