import { Module } from "@nestjs/common";
import { AuthHandler } from "./auth.handler";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { ClientsModule, Transport } from "@nestjs/microservices";

const RABBITMQ_URL =
  process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";

@Module({
  imports: [
    JwtModule.register({ secret: "secret" }),
    ClientsModule.register([
      {
        name: "USERS_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: [RABBITMQ_URL],
          queue: "users_queue",
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [AuthHandler],
  providers: [AuthService],
})
export class AuthAppModule {}
