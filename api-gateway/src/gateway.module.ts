import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { UsersController } from "./users.controller";
import { OrdersController } from "./orders.controller";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { AuthGuard } from "./guards/auth.guard";

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
      {
        name: "AUTH_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: [RABBITMQ_URL],
          queue: "auth_queue",
          queueOptions: { durable: true },
        },
      },
      {
        name: "ORDERS_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: [RABBITMQ_URL],
          queue: "orders_queue",
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [UsersController, OrdersController, AuthController],
  providers: [AuthGuard],
})
export class GatewayModule {}
