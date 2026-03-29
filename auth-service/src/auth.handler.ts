import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from "@nestjs/microservices";
import { LoginDto } from "./dto/login.dto";

@Controller()
export class AuthHandler {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern("auth.register")
  register(@Payload() dto: RegisterDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const result = this.authService.register(dto);
      channel.ack(originalMsg);
      return result;
    } catch (error) {
      channel.nack(originalMsg);
      throw error;
    }
  }

  @MessagePattern("auth.login")
  login(@Payload() dto: LoginDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const result = this.authService.login(dto);
      channel.ack(originalMsg);
      return result;
    } catch (error) {
      channel.ack(originalMsg);
      throw error;
    }
  }
}
