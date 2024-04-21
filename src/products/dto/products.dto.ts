import { Exclude, Expose, Transform, Type } from 'class-transformer';

export class ProductsDTO {
  @Expose()
  total: number;

  @Expose()
  totalPage: number;
  @Expose()
  @Type(() => ProductList)
  products: ProductList[];
}

export class ProductList {
  @Expose({ name: 'product_id' })
  id: number;

  @Expose({ name: 'product_title' })
  title: string;

  @Expose({ name: 'product_description' })
  description: string;

  @Expose({ name: 'product_price' })
  price: number;

  @Expose({ name: 'product_stock' })
  stock: number;

  @Expose({ name: 'product_images' })
  @Transform(({ value }) => value.toString().split(','))
  images: string[];

  @Transform(({ obj }) => ({
    id: obj.category_id,
    title: obj.category_title,
  }))
  @Expose()
  category: any;

  @Expose({ name: 'reviewCount' })
  review: number;

  @Expose({ name: 'avgRating' })
  rating: number;

  // Ẩn các trường không cần thiết
  @Exclude({ toClassOnly: true })
  product_createdAt: string;

  @Exclude({ toClassOnly: true })
  product_updatedAt: string;

  @Exclude({ toClassOnly: true })
  product_addedById: number;

  @Exclude({ toClassOnly: true })
  product_categoryId: number;

  @Exclude({ toClassOnly: true })
  category_id: number;

  @Exclude({ toClassOnly: true })
  category_description: string;

  @Exclude({ toClassOnly: true })
  category_createdAt: string;

  @Exclude({ toClassOnly: true })
  category_updatedAt: string;

  @Exclude({ toClassOnly: true })
  category_addedById: number;
}
