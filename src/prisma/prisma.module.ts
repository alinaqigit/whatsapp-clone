import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [
    PrismaService,
    // Register the PrismaExceptionFilter as an application-level filter so that
    // Prisma errors thrown from services/controllers are translated to HTTP responses
  ],
  imports: [ConfigModule],
  exports: [PrismaService],
})
export class PrismaModule {}
