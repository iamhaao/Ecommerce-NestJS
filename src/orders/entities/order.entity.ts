import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { OrderStatus } from '../enums/oder-status.enum';
import { User } from 'src/users/entities/user.entity';
import { Shipping } from './shipping.entity';
import { OrdersProducts } from './orders-products.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  orderAt: Timestamp;

  @Column({ default: OrderStatus.PROCESSING })
  status: string;

  @Column({ nullable: true })
  shippedAt: Date;
  @Column({ nullable: true })
  deliveredAt: Date;

  @ManyToOne(() => User, (user) => user.oders)
  orderedBy: User;
  @OneToOne(() => Shipping, (shipping) => shipping.order, { cascade: true })
  @JoinColumn()
  shippingInformation: Shipping;

  @OneToMany(() => OrdersProducts, (op) => op.order)
  orderedProducts: OrdersProducts[];
}
