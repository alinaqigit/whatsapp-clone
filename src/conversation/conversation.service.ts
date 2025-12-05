import { Injectable } from '@nestjs/common';
import { ConversationRepository } from './conversation.repository';
import { Conversation } from 'generated/prisma/client';
import { CreateConversationDto } from 'src/common/dto';

@Injectable()
export class ConversationsService {
  constructor(private repo: ConversationRepository) {}

  async getConversationsForAUser(userId: string): Promise<Conversation[]> {
    // Fetch conversations for a specific user
    const conversations = await this.repo.getConversations(userId);

    return conversations;
  }

  async createConversation(
    userId: string,
    dto: CreateConversationDto,
  ): Promise<Conversation> {
    // Logic to create a new conversation
    const conversation = await this.repo.createConversation(userId, dto);
    return conversation;
  }
}
