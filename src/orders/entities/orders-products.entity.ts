import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from 'src/products/entities/product.entity';

@Entity({ name: 'orders_products' })
export class OrdersProducts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  product_price: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Order, (order) => order.orderedProducts)
  order: Order;

  @ManyToOne(() => Product, (pro) => pro.orders, { cascade: true })
  product: Product;
}
