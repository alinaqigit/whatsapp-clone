import { HttpStatus, Injectable } from '@nestjs/common';
import { ConversationRepository } from './conversation.repository';
import { Conversation } from 'generated/prisma/client';
import {
  AddUserToConversationDTO,
  CreateConversationDto,
} from 'src/common/dto';
import {
  ConversationNotFound,
  ConversationUnauthorizedAccess,
  MemberForConverstionNotFound,
} from 'src/common/exceptions';

@Injectable()
export class ConversationsService {
  constructor(private repo: ConversationRepository) {}

  async getConversationsForAUser(
    userId: string,
    Include?: boolean,
  ): Promise<Conversation[]> {
    // Fetch conversations for a specific user
    const conversations = await this.repo.getConversations(userId, Include);

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

  async addMembers(
    userId: string,
    conversation_Id_to_be_checked: string,
    dto: AddUserToConversationDTO,
  ): Promise<void> {
    // 1. First check if this Conversation exists or not

    const conversation = await this.repo.checkConversation(
      conversation_Id_to_be_checked,
    );

    if (!conversation)
      throw new ConversationNotFound(
        'W001',
        HttpStatus.NOT_FOUND,
        'Members cannot be added to conversation because conversation does not exists',
      );

    // 2. Check if the user is the owner of the conversation

    if (conversation.ownerId !== userId)
      throw new ConversationUnauthorizedAccess(
        "Unauthorized Access",
        HttpStatus.FORBIDDEN,
        'Only the owner can add members to this conversation',
        'User trying to add members is not the owner of the conversation',
      );

    // 3. Check if members to be added exist or not

    const result = await this.repo.checkMembers(dto.members);

    if (!result)
      throw new MemberForConverstionNotFound(
        'P2025',
        HttpStatus.NOT_FOUND,
        'Specified member(s) for this conversation not found',
      );

    // 4. Finally add members to the conversation

    return await this.repo.addMembers(conversation.id, dto.members);
  }
}
