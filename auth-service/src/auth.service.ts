import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto/register.dto";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { firstValueFrom, timeout } from "rxjs";
import { MSG } from "../../shared/message-patterns";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject("USERS_SERVICE")
    private readonly userClient: ClientProxy,
  ) {}

  async register(dto: RegisterDto) {
    const user = await firstValueFrom(
      this.userClient.send(MSG.USERS_CREATE, dto),
    );
    const payload = { id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(dto: LoginDto) {
    try {
      const user = await firstValueFrom(
        this.userClient
          .send(MSG.USERS_FIND_ONE, { email: dto.email })
          .pipe(timeout(5000)),
      );
      const payload = { id: user.id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: "Invalid credentials",
      });
    }
  }
}
