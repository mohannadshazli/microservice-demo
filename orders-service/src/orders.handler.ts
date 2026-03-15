import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { OrdersService } from "./orders.service";
import { MSG } from "./../../shared/message-patterns";

@Controller()
export class OrdersHandler {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern(MSG.ORDERS_CREATE)
  create(
    @Payload()
    data: {
      userId: string;
      items: { productId: string; quantity: number; price: number }[];
    },
  ) {
    console.log({ data });
    return this.ordersService.create(data);
  }

  @MessagePattern(MSG.ORDERS_FIND_USER)
  findByUser(@Payload() data: { userId: string }) {
    return this.ordersService.findByUser(data.userId);
  }

  @MessagePattern(MSG.ORDERS_FIND_ONE)
  findOne(@Payload() data: { id: string }) {
    return this.ordersService.findOne(data.id);
  }

  @MessagePattern(MSG.ORDERS_CANCEL)
  cancel(@Payload() data: { id: string }) {
    return this.ordersService.cancel(data.id);
  }
}
