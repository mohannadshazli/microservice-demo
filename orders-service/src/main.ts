import { NestFactory } from "@nestjs/core";
import { Transport, MicroserviceOptions } from "@nestjs/microservices";
import { OrdersAppModule } from "./orders-app.module";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    OrdersAppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672"],
        queue: "orders_queue",
        queueOptions: { durable: true },
        noAck: false,
      },
    },
  );

  await app.listen();
  console.log(" Orders Service listening on orders_queue");
}
bootstrap();
