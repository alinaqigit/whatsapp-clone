import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConversationsService } from './conversation.service';
import { Conversation } from 'generated/prisma/browser';
import { JwtGuard } from 'src/common/guards';
import { GetUser } from 'src/common/decorators';
import {
  AddUserToConversationDTO,
  CreateConversationDto,
} from 'src/common/dto';
import { ConversationEntity } from 'src/common/entities';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtGuard)
@Controller('conversation')
export class ConversationController {
  constructor(private conversation: ConversationsService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async getConversationsForAUser(
    @GetUser('id') userId: string,
  ): Promise<ConversationEntity[]> {
    // Fetch conversations for a specific user
    const conversations = await this.conversation.getConversationsForAUser(
      userId,
      true,
    );
    const safe_to_send_conversations: ConversationEntity[] = [];
    conversations.forEach((conversation) => {
      safe_to_send_conversations.push(new ConversationEntity(conversation));
    });

    return safe_to_send_conversations;
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createConversation(
    @GetUser('id') userId: string,
    @Body() dto: CreateConversationDto,
  ): Promise<Conversation> {
    // Logic to create a new conversation
    return this.conversation.createConversation(userId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id/add-member')
  async addMembers(
    @GetUser('id') userId: string,
    @Param('id') conversationId: string,
    @Body() dto: AddUserToConversationDTO,
  ): Promise<void> {
    return await this.conversation.addMembers(userId, conversationId, dto);
  }
}
