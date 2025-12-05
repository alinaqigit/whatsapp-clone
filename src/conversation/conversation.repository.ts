import { Injectable } from '@nestjs/common';
import { Conversation } from 'generated/prisma/client';
import { CreateConversationDto } from 'src/common/dto';
import { mapPrismaError } from 'src/common/mapper';
import { mapConversationError } from 'src/common/mapper/conversatoin.mapper';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ConversationRepository {
  constructor(private prisma: PrismaService) {}

  public async getConversations(userId: string): Promise<Conversation[]> {
    try {
      return this.getConversationThroughPrisma(userId);
    }catch(error) {
      mapConversationError(error);
    }
  }

  public async createConversation(userId: string, dto: CreateConversationDto): Promise<Conversation> {
    try {
      return this.createConversationThroughPrisma(userId, dto);
    } catch (error) {
      mapConversationError(error);
    }
  }

  private async getConversationThroughPrisma(userId: string): Promise<Conversation[]>{
    try {
      return this.prisma.conversation.findMany({
        where: {
          participants: {
            some: {
              id: userId,
            },
          },
        },
      });
    } catch (error) {
      mapPrismaError(error);
    }
  }

  private async createConversationThroughPrisma(userId: string, dto: CreateConversationDto): Promise<Conversation> {

    try {
      return this.prisma.conversation.create({
        data: {
          participants: {
            connect: [
              { id: userId }, 
              ...dto.members.map(email => ({ email }))
            ],
          },
          owner: {
            connect: { id: userId },
          },
          name: dto.name,
        },
      });
      
    } catch (error) {
      mapPrismaError(error);
    }
  }

}