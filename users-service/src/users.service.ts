import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { MSG } from "../../shared/message-patterns";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    @Inject("NOTIFICATION_SERVICE")
    private readonly notificationClient: ClientProxy,
  ) {}

  async create(data: {
    email: string;
    username: string;
    password: string;
  }): Promise<User> {
    const existing = await this.repo.findOne({ where: { email: data.email } });
    if (existing)
      throw new ConflictException(`Email ${data.email} already in use`);
    const user = await this.repo.save(this.repo.create(data));
    this.notificationClient.emit(MSG.USERS_CREATE, data);
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.repo.find();
  }

  async findOne(email: string): Promise<User> {
    const user = await this.repo.findOne({ where: { email } });
    if (!user)
      throw new RpcException({
        statusCode: 404,
        message: `User with email ${email} not found`,
      });
    return user;
  }

  async update(id: string, data: { name?: string }): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, data);
    return this.repo.save(user);
  }

  async deactivate(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.isActive = false;
    return this.repo.save(user);
  }
}
