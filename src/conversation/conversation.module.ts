import { Module } from '@nestjs/common';
import { ConversationsService } from './conversation.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConversationController } from './conversation.controller';
import { ConversationRepository } from './conversation.repository';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [ConversationsService, ConversationRepository],
  imports: [PrismaModule, UserModule],
  controllers: [ConversationController],
})
export class ConversationsModule {}
