import { Controller } from "@nestjs/common";
import { Ctx, MessagePattern, Payload } from "@nestjs/microservices";
import { UsersService } from "./users.service";
import { MSG } from "./../../shared/message-patterns";
import { RmqContext } from "@nestjs/microservices";

@Controller()
export class UsersHandler {
  constructor(private readonly usersService: UsersService) {}

  // @MessagePattern("users.create")
  // create(@Payload() data: { email: string; name: string }) {
  //   console.log({ data });
  //   return this.usersService.create(data);
  // }

  @MessagePattern("users.create")
  create(
    @Payload() data: { email: string; name: string },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const result = this.usersService.create(data);
      channel.ack(originalMsg);
      return result;
    } catch (error) {
      channel.nack(originalMsg, false, true);
      throw error;
    }
  }

  @MessagePattern(MSG.USERS_FIND_ALL)
  findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern(MSG.USERS_FIND_ONE)
  findOne(@Payload() data: { id: string }) {
    return this.usersService.findOne(data.id);
  }

  @MessagePattern(MSG.USERS_UPDATE)
  update(@Payload() data: { id: string; name?: string }) {
    const { id, ...rest } = data;
    return this.usersService.update(id, rest);
  }

  @MessagePattern(MSG.USERS_DEACTIVATE)
  deactivate(@Payload() data: { id: string }) {
    return this.usersService.deactivate(data.id);
  }

  @MessagePattern("*")
  handleUnknown(@Payload() data: any, @Ctx() context: RmqContext) {
    console.warn("Unknown pattern received:", context.getPattern(), data);
  }
}
