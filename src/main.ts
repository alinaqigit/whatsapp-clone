import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UserExceptionFilter } from './user.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, 
    
  );

  //Cors Policy

  app.enableCors({
    origin: '*',  // Allow all origins
  });

  // Use Logger
  // app.useLogger(app.get(Logger))

  // Enable Validation Globally

  app.useGlobalPipes( new ValidationPipe({
    whitelist: true,
  }) );

  //Enable filters globally

  app.useGlobalFilters(new UserExceptionFilter());

  // Finally start the server

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
