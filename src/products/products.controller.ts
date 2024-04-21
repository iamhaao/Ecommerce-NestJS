import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  Public,
  Roles,
} from 'src/utility/decorators/authorize-roles.decorator';
import { Role } from 'src/utility/common/user-role.enum';
import { Product } from './entities/product.entity';
import { UserCurrent } from 'src/utility/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { SerializeIncludes } from 'src/utility/interceptor.ts/serialize.interceptor';
import { ProductsDTO } from './dto/products.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(Role.ADMIN)
  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @UserCurrent() currentUser: User,
  ): Promise<Product> {
    return await this.productsService.create(createProductDto, currentUser);
  }

  @SerializeIncludes(ProductsDTO)
  @Public()
  @Get()
  async findAll(@Query() query: any): Promise<ProductsDTO> {
    return await this.productsService.findAll(query);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return await this.productsService.findOne(+id);
  }

  @Roles(Role.ADMIN)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UserCurrent() currentUser: User,
  ): Promise<Product> {
    return await this.productsService.update(
      +id,
      updateProductDto,
      currentUser,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
