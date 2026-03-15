// ── main.ts ──────────────────────────────────────────────────────────────────
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { PaymentsAppModule } from './payments-app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PaymentsAppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
        queue: 'payments_queue',
        queueOptions: { durable: true },
        noAck: false,
      },
    },
  );
  await app.listen();
  console.log('💳 Payments Service listening on payments_queue');
}
bootstrap();
