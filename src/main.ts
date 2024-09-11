import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupDataSource } from './appDataSource';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await setupDataSource();
  await app.listen(process.env.PORT);
}
bootstrap();
