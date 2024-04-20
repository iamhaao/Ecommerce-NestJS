import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UserCurrent } from 'src/utility/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/utility/common/user-role.enum';
import {
  Public,
  Roles,
} from 'src/utility/decorators/authorize-roles.decorator';
import { Category } from './entities/category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(Role.ADMIN)
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UserCurrent() currentUser: User,
  ): Promise<Category> {
    return await this.categoriesService.create(createCategoryDto, currentUser);
  }

  @Public()
  @Get()
  async findAll(): Promise<Category[]> {
    return await this.categoriesService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category> {
    return await this.categoriesService.findOne(+id);
  }

  @Roles(Role.ADMIN)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return await this.categoriesService.update(+id, updateCategoryDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
