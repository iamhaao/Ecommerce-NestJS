import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { RoleEntity } from './role.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Product } from 'src/products/entities/product.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Order } from 'src/orders/entities/order.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToMany((type) => RoleEntity, { cascade: true })
  @JoinTable()
  roles: RoleEntity[];

  @CreateDateColumn()
  createdAt: Timestamp;
  @UpdateDateColumn()
  updated: Timestamp;
  @OneToMany((type) => Category, (cat) => cat.addedBy)
  categories: Category[];
  @OneToMany((type) => Product, (pro) => pro.addedBy)
  products: Product[];
  @OneToMany((type) => Review, (review) => review.reviewBy)
  reviews: Review[];
  @OneToMany(() => Order, (order) => order.orderedBy)
  oders: Order[];
}
