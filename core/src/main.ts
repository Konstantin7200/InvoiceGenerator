import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { validateEnv } from './config/validate-env';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  validateEnv();
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  await app.listen(configService.port);
}
bootstrap();
