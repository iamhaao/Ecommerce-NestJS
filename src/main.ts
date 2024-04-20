import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';
import { AuthorizationGuard } from './utility/guards/authorization.guard';
import { AuthenticationGuard } from './utility/guards/authentication.guard';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  config();
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.useGlobalGuards(
    new AuthenticationGuard(new Reflector()),
    new AuthorizationGuard(new Reflector()),
  );

  await app.listen(3000);
}
bootstrap();
