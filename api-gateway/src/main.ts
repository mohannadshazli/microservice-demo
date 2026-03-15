import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { GatewayModule } from "./gateway.module";

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(3000);
  console.log("API Gateway running on port 3000");
}
bootstrap();
