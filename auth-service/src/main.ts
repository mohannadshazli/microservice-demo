import { NestFactory } from "@nestjs/core";
import { Transport, MicroserviceOptions } from "@nestjs/microservices";
import { AuthAppModule } from "./auth-app.module";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthAppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672"],
        queue: "auth_queue",
        queueOptions: { durable: true },
        // manual acknowledgment (safer for production)
        noAck: false,
      },
    },
  );

  await app.listen();
  console.log("Auth Service listening on auth_queue");
}
bootstrap();
