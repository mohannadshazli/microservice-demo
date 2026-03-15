// ── payment.entity.ts ────────────────────────────────────────────────────────
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum PaymentStatus {
  SUCCESS  = 'success',
  FAILED   = 'failed',
  REFUNDED = 'refunded',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'text', default: PaymentStatus.SUCCESS })
  status: PaymentStatus;

  @CreateDateColumn()
  processedAt: Date;
}
