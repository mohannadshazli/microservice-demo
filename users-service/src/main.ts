import { NestFactory } from "@nestjs/core";
import { Transport, MicroserviceOptions } from "@nestjs/microservices";
import { UsersAppModule } from "./users-app.module";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersAppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672"],
        queue: "users_queue",
        queueOptions: { durable: true },
        // manual acknowledgment (safer for production)
        noAck: false,
      },
    },
  );

  await app.listen();
  console.log("Users Service listening on users_queue");
}
bootstrap();
