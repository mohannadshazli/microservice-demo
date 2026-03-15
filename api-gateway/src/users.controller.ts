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
import { IsEmail, IsString, MinLength, IsUUID } from "class-validator";
import { firstValueFrom } from "rxjs";
import { MSG } from "../../shared/message-patterns";

class CreateUserDto {
  @IsEmail() email: string;
  @IsString() @MinLength(2) name: string;
}

class UpdateUserDto {
  @IsString() @MinLength(2) name?: string;
}

@Controller("users")
export class UsersController {
  constructor(
    @Inject("USERS_SERVICE") private readonly usersClient: ClientProxy,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateUserDto) {
    console.log({ dto });
    return firstValueFrom(this.usersClient.send("users.create", dto));
  }

  @Get()
  findAll() {
    return firstValueFrom(this.usersClient.send(MSG.USERS_FIND_ALL, {}));
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return firstValueFrom(this.usersClient.send(MSG.USERS_FIND_ONE, { id }));
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() dto: UpdateUserDto) {
    return firstValueFrom(
      this.usersClient.send(MSG.USERS_UPDATE, { id, ...dto }),
    );
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  deactivate(@Param("id") id: string) {
    return firstValueFrom(this.usersClient.send(MSG.USERS_DEACTIVATE, { id }));
  }
}
