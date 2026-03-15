import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Payment, PaymentStatus } from './payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly repo: Repository<Payment>,
  ) {}

  async process(orderId: string, amount: number): Promise<Payment> {
    // Call external payment gateway (simulated)
    const success = await this.callGateway(amount);

    const payment = this.repo.create({
      orderId,
      amount,
      status: success ? PaymentStatus.SUCCESS : PaymentStatus.FAILED,
    });

    const saved = await this.repo.save(payment);

    if (!saved.status || saved.status === PaymentStatus.FAILED) {
      // RpcException propagates back through RabbitMQ to the caller
      throw new RpcException('Payment gateway declined the transaction');
    }

    return saved;
  }

  async refund(orderId: string): Promise<Payment> {
    const payment = await this.repo.findOne({ where: { orderId } });
    if (!payment) throw new RpcException(`No payment for order ${orderId}`);
    payment.status = PaymentStatus.REFUNDED;
    return this.repo.save(payment);
  }

  // Simulate 90% success rate
  private async callGateway(_amount: number): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 80));
    return Math.random() > 0.1;
  }
}
