import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { Order } from "./order.entity";
import { OrdersHandler } from "./orders.handler";
import { OrdersService } from "./orders.service";

const RABBITMQ_URL =
  process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";

@Module({
  imports: [
    // Orders has its own isolated database
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "orders.db",
      entities: [Order],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Order]),

    // Orders needs to call Users + Payments services
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
        name: "PAYMENTS_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: [RABBITMQ_URL],
          queue: "payments_queue",
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [OrdersHandler],
  providers: [OrdersService],
})
export class OrdersAppModule {}
