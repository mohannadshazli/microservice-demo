import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum OrderStatus {
  PENDING   = 'pending',
  CONFIRMED = 'confirmed',
  PAID      = 'paid',
  CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column('simple-json')
  items: { productId: string; quantity: number; price: number }[];

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'text', default: OrderStatus.PENDING })
  status: OrderStatus;

  @CreateDateColumn()
  createdAt: Date;
}
