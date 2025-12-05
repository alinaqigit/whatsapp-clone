import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ConversationsService } from './conversation.service';
import { Conversation } from 'generated/prisma/browser';
import { JwtGuard } from 'src/common/guards';
import { GetUser } from 'src/common/decorators';
import { CreateConversationDto } from 'src/common/dto';

@UseGuards(JwtGuard)
@Controller('conversation')
export class ConversationController {
  constructor(private conversationService: ConversationsService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async getConversationsForAUser(
    @GetUser('id') userId: string
  ): Promise<Conversation[]> {
    // Fetch conversations for a specific user
    const conversations =
      await this.conversationService.getConversationsForAUser(userId);

    return conversations;
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createConversation(
    @GetUser('id') userId: string,
    @Body() dto: CreateConversationDto,
  ): Promise<Conversation> {
    // Logic to create a new conversation
    return this.conversationService.createConversation(userId, dto);
  }

  @Patch(':id/add-user')
  async updateConversation(): Promise<void> {
    // Logic to update an existing conversation
  }
}
