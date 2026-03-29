import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Inject,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { IsEmail, IsString, MinLength } from "class-validator";
import { firstValueFrom, timeout } from "rxjs";
import { MSG } from "../../shared/message-patterns";

class RegisterDto {
  @IsEmail() email: string;
  @IsString() @MinLength(2) username: string;
  @IsString() @MinLength(6) password: string;
}

class LoginDto {
  @IsEmail() email: string;
  @IsString() @MinLength(6) password: string;
}

@Controller("auth")
export class AuthController {
  constructor(
    @Inject("AUTH_SERVICE") private readonly authClient: ClientProxy,
  ) {}

  @Post("/register")
  @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: RegisterDto) {
    return firstValueFrom(this.authClient.send("auth.register", dto));
  }

  @Post("/login")
  @HttpCode(HttpStatus.CREATED)
  login(@Body() dto: LoginDto) {
    return firstValueFrom(
      this.authClient.send("auth.login", dto).pipe(timeout(5000)),
    );
  }
}
