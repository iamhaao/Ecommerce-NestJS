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
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import {
  Public,
  Roles,
} from 'src/utility/decorators/authorize-roles.decorator';
import { Role } from 'src/utility/common/user-role.enum';
import { UserCurrent } from 'src/utility/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Review } from './entities/review.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Roles(Role.USER, Role.ADMIN)
  @Post()
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @UserCurrent() currentUser: User,
  ): Promise<Review> {
    return await this.reviewsService.create(createReviewDto, currentUser);
  }
  @Public()
  @Get()
  async findAllByProduct(
    @Body('productId') productId: number,
  ): Promise<Review[]> {
    return await this.reviewsService.findAllByProduct(productId);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Review> {
    return await this.reviewsService.findOneById(+id);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @UserCurrent() currentUser: User,
  ): Promise<Review> {
    return await this.reviewsService.update(+id, updateReviewDto, currentUser);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string, @UserCurrent() currentUser: User) {
    return await this.reviewsService.remove(+id, currentUser);
  }
}
