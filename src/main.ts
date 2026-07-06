import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './utils/interceptor/response.interceptor';
import { GlobalExceptionFilter } from './utils/all-exception.filter';
import { validationExceptionFactory } from './utils/factory/validation-exception.factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: validationExceptionFactory,
    }),
  );

  app.useGlobalFilters(
    new GlobalExceptionFilter(),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
