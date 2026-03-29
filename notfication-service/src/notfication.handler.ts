import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";
import { NotficationService } from "./notfication.service";
import { MSG } from "shared/message-patterns";

@Controller("notfication")
export class NotficationHandler {
  constructor(private readonly notficationService: NotficationService) {}

  @EventPattern(MSG.USERS_CREATE)
  async handleNotificationSend(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.notficationService.sendWelcomeEmail(data.email, data.name);
      console.log("Notification sent successfully");
      channel.ack(originalMsg);
    } catch (error) {
      console.error("Error processing notification:", error);
      channel.nack(originalMsg);
    }
  }
}
