import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { User } from 'src/users/entities/user.entity';
import { Review } from './entities/review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsService } from 'src/products/products.service';
import { Role } from 'src/utility/common/user-role.enum';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly productServices: ProductsService,
  ) {}
  async create(createReviewDto: CreateReviewDto, user: User): Promise<Review> {
    const product = await this.productServices.findOne(
      +createReviewDto.productId,
    );
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    let reviewed = await this.findOneByUserAndProduct(
      user.id,
      createReviewDto.productId,
    );
    if (!reviewed) {
      reviewed = this.reviewRepository.create(createReviewDto);
      reviewed.reviewBy = user;
      reviewed.product = product;
    } else {
      reviewed.comment = createReviewDto.comment;
      reviewed.rating = createReviewDto.rating;
    }

    return await this.reviewRepository.save(reviewed);
  }

  async findAllByProduct(productId: number): Promise<Review[]> {
    const product = await this.productServices.findOne(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    return await this.reviewRepository.find({
      where: { product: { id: productId } },
      relations: {
        reviewBy: true,
        product: {
          category: true,
        },
      },
    });
  }

  async findOneById(id: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: {
        id,
      },
      relations: {
        reviewBy: true,
        product: {
          category: true,
        },
      },
      select: {
        reviewBy: {
          name: true,
          email: true,
          id: true,
        },
        product: {
          price: true,
          title: true,
        },
      },
    });
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto, user: User) {
    const review = await this.findOneById(id);
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    if (user.id !== review.reviewBy.id) {
      throw new ForbiddenException('You are not allowed edit this comment!');
    }
    Object.assign(review, updateReviewDto);

    return await this.reviewRepository.save(review);
  }

  async remove(id: number, user: User) {
    const review = await this.findOneById(id);
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    const isAdmin = user.roles.some((role) => role.name === Role.ADMIN);
    if (!isAdmin && review.reviewBy.id !== user.id) {
      throw new ForbiddenException('You are not allowed delete this comment');
    }
    await this.reviewRepository.remove(review);
    return 'Deleted Success Comment';
  }

  async findOneByUserAndProduct(userId: number, productId: number) {
    return await this.reviewRepository.findOne({
      where: {
        reviewBy: {
          id: userId,
        },
        product: {
          id: productId,
        },
      },
      relations: {
        reviewBy: true,
        product: {
          category: true,
        },
      },
    });
  }
}
