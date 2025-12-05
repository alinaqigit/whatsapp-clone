import { Module } from '@nestjs/common';
import { ConversationsService } from './conversation.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConversationController } from './conversation.controller';
import { ConversationRepository } from './conversation.repository';

@Module({
  providers: [ConversationsService, ConversationRepository],
  imports: [PrismaModule],
  controllers: [ConversationController],
})
export class ConversationsModule {}
