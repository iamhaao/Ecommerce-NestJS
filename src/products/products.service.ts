import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Like, Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { User } from 'src/users/entities/user.entity';
import { OrderStatus } from 'src/orders/enums/oder-status.enum';
import { Category } from 'src/categories/entities/category.entity';
import { ProductList } from './dto/products.dto';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoryServices: CategoriesService,
    @Inject(forwardRef(() => OrdersService))
    private readonly orderServices: OrdersService,
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
  async findAll(
    query: any,
  ): Promise<{ products: ProductList[]; total; totalPage }> {
    let page: number;
    let limit: number;
    let search: string;

    if (!query.limit) {
      limit = 10;
    } else {
      limit = Number(query.limit);
    }

    if (!query.page) {
      page = 1;
    } else {
      page = Number(query.page);
    }

    if (!query.search) {
      search = '';
    } else {
      search = query.search;
    }

    const qb = this.productRepository.createQueryBuilder('product');

    qb.leftJoinAndSelect('product.category', 'category')
      .leftJoin('product.reviews', 'review')
      .addSelect([
        'COUNT(review.id) as reviewCount',
        'CAST(AVG(review.rating) AS DECIMAL(10,2)) as avgRating',
      ])
      .where('product.title LIKE :search', { search: `%${search}%` })
      .groupBy('product.id, category.id')
      .take(limit)
      .skip((page - 1) * limit);

    if (query.category) {
      qb.andWhere('category.id = :categoryId', {
        categoryId: Number(query.category),
      });
    }

    if (query.minPrice) {
      qb.andWhere('product.price >= :minPrice', { minPrice: query.minPrice });
    }

    if (query.maxPrice) {
      qb.andWhere('product.price <= :maxPrice', { maxPrice: query.maxPrice });
    }
    if (query.minRating) {
      qb.andHaving('AVG(review.rating)>=:minRating', {
        minRating: query.minRating,
      });
    }
    if (query.maxRating) {
      qb.andHaving('AVG(review.rating)<=:maxRating', {
        maxRating: query.maxRating,
      });
    }
    const products = await qb.getRawMany();
    const total = await qb.getCount();
    const totalPage = Math.ceil(total / limit);

    return { products, total, totalPage };
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

  async remove(id: number) {
    const product = await this.findOne(id);

    const order = await this.orderServices.findOneByProductId(product.id);
    if (order) throw new BadRequestException('Product is in orders !!!!');
    return await this.productRepository.remove(product);
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
