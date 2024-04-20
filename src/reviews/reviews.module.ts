import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { ProductsService } from 'src/products/products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [ProductsModule, TypeOrmModule.forFeature([Review])],

  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
