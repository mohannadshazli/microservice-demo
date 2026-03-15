import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { PaymentsService } from "./payments.service";
import { MSG } from "./../../shared/message-patterns";

@Controller()
export class PaymentsHandler {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern(MSG.PAYMENTS_PROCESS)
  process(@Payload() data: { orderId: string; amount: number }) {
    console.log("Payment is processing !!!!!");
    return this.paymentsService.process(data.orderId, data.amount);
  }

  @MessagePattern(MSG.PAYMENTS_REFUND)
  refund(@Payload() data: { orderId: string }) {
    return this.paymentsService.refund(data.orderId);
  }
}
