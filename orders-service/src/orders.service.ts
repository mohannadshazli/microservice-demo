import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { catchError, throwError } from "rxjs";
import { Order, OrderStatus } from "./order.entity";
import { MSG } from "./../../shared/message-patterns";

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepo: Repository<Order>,

    /**
     * No direct injection of UsersService or PaymentsService!
     * Communication happens via RabbitMQ messages only.
     * This is the KEY difference from the monolith.
     */
    @Inject("USERS_SERVICE")
    private readonly usersClient: ClientProxy,

    @Inject("PAYMENTS_SERVICE")
    private readonly paymentsClient: ClientProxy,
  ) {}

  async create(dto: {
    userId: string;
    items: { productId: string; quantity: number; price: number }[];
  }): Promise<Order> {
    // 1. Verify user exists — network call to Users Service
    console.log("Verify");
    const user = await firstValueFrom(
      this.usersClient
        .send(MSG.USERS_FIND_ONE, { id: dto.userId })
        .pipe(
          catchError((err) =>
            throwError(
              () => new RpcException(`User not found: ${err.message}`),
            ),
          ),
        ),
    );

    console.log({ user });

    if (!user.isActive) {
      throw new RpcException("User account is deactivated");
    }

    // 2. Calculate total
    const total = dto.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    console.log({ total });
    // 3. Create order (PENDING)
    const order = await this.ordersRepo.save(
      this.ordersRepo.create({ ...dto, total, status: OrderStatus.PENDING }),
    );

    // 4. Request payment — network call to Payments Service
    try {
      await firstValueFrom(
        this.paymentsClient.send(MSG.PAYMENTS_PROCESS, {
          orderId: order.id,
          amount: total,
        }),
      );

      // 5. Payment succeeded — mark as PAID
      order.status = OrderStatus.PAID;
      return this.ordersRepo.save(order);
    } catch (err) {
      /*
       * SAGA TRANSACTION
       * Payment failed → cancel the order we just created.
       * In a full Saga, we'd also publish an event to notify
       * other services to roll back their changes.
       */
      order.status = OrderStatus.CANCELLED;
      await this.ordersRepo.save(order);

      throw new RpcException(`Payment failed, order cancelled: ${err.message}`);
    }
  }

  async findByUser(userId: string): Promise<Order[]> {
    return this.ordersRepo.find({ where: { userId } });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepo.findOne({ where: { id } });
    if (!order) throw new RpcException(`Order ${id} not found`);
    return order;
  }

  async cancel(id: string): Promise<Order> {
    const order = await this.findOne(id);
    if (order.status === OrderStatus.PAID) {
      throw new RpcException("Cannot cancel a paid order");
    }
    order.status = OrderStatus.CANCELLED;
    return this.ordersRepo.save(order);
  }
}
