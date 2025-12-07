import { HttpStatus, Injectable } from '@nestjs/common';
import { ConversationRepository } from './conversation.repository';
import { Conversation } from 'generated/prisma/client';
import {
  AddUserToConversationDTO,
  CreateConversationDto,
} from 'src/common/dto';
import { MemberForConverstionNotFound } from 'src/common/exceptions';

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

    // First Fetch the members to check if they exist
    const result = await this.repo.checkMembers(dto.members);

    if (!result)
      throw new MemberForConverstionNotFound(
        'P2025',
        HttpStatus.NOT_FOUND,
        'Specified member(s) for this conversation not found',
      );

    const conversation = await this.repo.createConversation(userId, dto);
    return conversation;
  }

  async addMembers(conversationId: string, dto: AddUserToConversationDTO) {
    // 1. First check if this Conversation exists or not
    
  }
}
