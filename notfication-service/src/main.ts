import { NestFactory } from "@nestjs/core";
import { Transport, MicroserviceOptions } from "@nestjs/microservices";
import { NotficationAppModule } from "./notfication-app.module";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotficationAppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672"],
        queue: "notification_queue",
        queueOptions: { durable: true },
        noAck: false,
      },
    },
  );

  await app.listen();
  console.log(" Notification Service listening on notification_queue");
}
bootstrap();
