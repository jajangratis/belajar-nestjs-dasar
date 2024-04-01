import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { ConfigService } from "@nestjs/config";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
// import { ValidationFilter } from "./validation/validation.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const loggerService = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(loggerService);
  app.use(cookieParser("MY_SECRET"));

  // SAMPLE GLOBAL FILTER
  // app.useGlobalInterceptors(...)
  // app.useGlobalGuards(...)
  // app.useGlobalFilters(new ValidationFilter());

  app.enableShutdownHooks();

  const configService = app.get(ConfigService);
  await app.listen(configService.get("PORT"));
}
bootstrap();
