import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { ConfigService } from '@nestjs/config';
import { configApp } from './config';
import { RequestLoggerMiddleware } from '@app/logger/middleware';

async function bootstrap() {
  const port = new ConfigService().get('PORT');
  const app = await NestFactory.create(ApiModule);

  configApp(app);
  app.use(new RequestLoggerMiddleware().use);
  await app.listen(port || 3000, () => console.log(`Server running on PORT: ${port || 3000}`));
}
bootstrap();
