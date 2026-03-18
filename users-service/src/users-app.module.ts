import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UsersHandler } from "./users.handler";
import { UsersService } from "./users.service";
import { ClientsModule, Transport } from "@nestjs/microservices";

const RABBITMQ_URL =
  process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "NOTIFICATION_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: [RABBITMQ_URL],
          queue: "notification_queue",
          queueOptions: { durable: true },
        },
      },
    ]),
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "users.db",
      entities: [User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersHandler],
  providers: [UsersService],
})
export class UsersAppModule {}
