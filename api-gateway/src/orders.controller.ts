import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Inject,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import {
  IsUUID,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
} from "class-validator";
import { Type } from "class-transformer";
import { firstValueFrom } from "rxjs";
import { MSG } from "../../shared/message-patterns";

// ── DTOs ──────────────────────────────────────────────────────────────────────
class OrderItemDto {
  @IsUUID() productId: string;
  @IsNumber() @Min(1) quantity: number;
  @IsNumber() @Min(0) price: number;
}

class CreateOrderDto {
  @IsUUID() userId: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

@Controller("orders")
export class OrdersController {
  constructor(
    @Inject("ORDERS_SERVICE") private readonly ordersClient: ClientProxy,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateOrderDto) {
    console.log({ dto });
    return firstValueFrom(this.ordersClient.send(MSG.ORDERS_CREATE, dto));
  }

  @Get("user/:userId")
  findByUser(@Param("userId") userId: string) {
    return firstValueFrom(
      this.ordersClient.send(MSG.ORDERS_FIND_USER, { userId }),
    );
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return firstValueFrom(this.ordersClient.send(MSG.ORDERS_FIND_ONE, { id }));
  }

  @Delete(":id/cancel")
  @HttpCode(HttpStatus.NO_CONTENT)
  cancel(@Param("id") id: string) {
    return firstValueFrom(this.ordersClient.send(MSG.ORDERS_CANCEL, { id }));
  }
}
