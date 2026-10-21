import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 本地开发允许跨域
  app.enableCors({
    origin: 'http://localhost:5173', // vue本地地址
    credentials: true, // 支持cookie/token
  });
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
