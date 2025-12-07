import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  UserExceptionFilter,
  ConversationExceptionFilter,
} from './exception-filters/';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Cors Policy

  app.enableCors({
    origin: '*', // Allow all origins
  });

  // Use Logger
  // app.useLogger(app.get(Logger))

  // Enable Validation Globally

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  //Enable filters globally

  app.useGlobalFilters(
    new UserExceptionFilter(),
    new ConversationExceptionFilter(),
  );

  // Finally start the server

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
