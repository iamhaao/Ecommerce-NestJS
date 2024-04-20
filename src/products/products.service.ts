import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { User } from 'src/users/entities/user.entity';
import { OrderStatus } from 'src/orders/enums/oder-status.enum';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoryServices: CategoriesService,
  ) {}
  async create(
    createProductDto: CreateProductDto,
    user: User,
  ): Promise<Product> {
    const category = await this.categoryServices.findOne(
      +createProductDto.categoryId,
    );
    const product = this.productRepository.create(createProductDto);
    product.category = category;
    product.addedBy = user;

    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        addedBy: true,
        category: true,
      },
      select: {
        addedBy: {
          name: true,
          email: true,
          id: true,
        },
        category: {
          title: true,
        },
      },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: Partial<UpdateProductDto>,
    currentUser: User,
  ): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    Object.assign(product, updateProductDto);
    product.addedBy = currentUser;
    if (updateProductDto.categoryId) {
      const category = await this.categoryServices.findOne(
        +updateProductDto.categoryId,
      );
      product.category = category;
    }

    return await this.productRepository.save(product);
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  async updateStock(id: number, stock: number, status: string) {
    let product = await this.findOne(id);
    if (status === OrderStatus.SHIPPING) {
      product.stock = product.stock - stock;
    }
    if (status === OrderStatus.CANCEL) {
      product.stock += stock;
    }
    const productUpdated = await this.productRepository.save(product);
    return productUpdated;
  }
}
