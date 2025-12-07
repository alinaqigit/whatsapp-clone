import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { UserExceptionFilter } from './exception-filters/user.filter';
import { ChatModule } from './chat/chat.module';
import { ConversationsModule } from './conversation/conversation.module';
import { ConversationExceptionFilter } from './exception-filters';

@Module({
  imports: [
    // LoggerModule.forRoot({
    //   pinoHttp: {
    //     level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
    //     // Other Pino options can be added here
    //   }}),
    AuthModule,
    PrismaModule,
    UserModule,
    ChatModule,
    ConversationsModule,
  ],
  providers: [UserExceptionFilter, ConversationExceptionFilter],
})
export class AppModule {}
