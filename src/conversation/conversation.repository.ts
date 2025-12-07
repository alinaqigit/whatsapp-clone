import { Injectable } from '@nestjs/common';
import { Conversation } from 'generated/prisma/client';
import {
  AddUserToConversationDTO,
  CreateConversationDto,
} from 'src/common/dto';
import { mapPrismaError } from 'src/common/mapper';
import { mapConversationError } from 'src/common/mapper/conversatoin.mapper';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ConversationRepository {
  constructor(
    private prisma: PrismaService,
    private user: UserService,
  ) {}

  // public methods

  public async getConversations(userId: string): Promise<Conversation[]> {
    try {
      return this.getManyConversationThroughPrisma(userId);
    } catch (error) {
      mapConversationError(error);
    }
  }

  public async createConversation(
    userId: string,
    dto: CreateConversationDto,
  ): Promise<Conversation> {
    try {
      return this.createConversationThroughPrisma(userId, dto);
    } catch (error) {
      mapConversationError(error);
    }
  }

  public async checkMembers(members: Array<string>): Promise<boolean> {
    try {
      console.log('Searching for members');

      for (let member of members) {
        await this.user.findByEmail(member);
      }

      console.log('Members found');

      return true;
    } catch (error) {
      console.log('Members not found');

      return false;
    }
  }

  public async checkConversation(
    conversationId: string,
  ): Promise<string | null> {
    // 1. Retrive Conversation through prisma
    const conversation =
      await this.getOneConversationThroughPrisma(conversationId);

    if (!conversation) return null;

    return conversation.id;
  }

  public async addMembers(
    conId: string,
    members: AddUserToConversationDTO['members'],
  ): Promise<void> {
    try {
      return await this.addMembersThroughPrisma(conId, members);
    } catch (error) {
      mapConversationError(error);
    }
  }

  // Utility methods

  private async addMembersThroughPrisma(
    conId: string,
    members: AddUserToConversationDTO['members'],
  ): Promise<void> {
    let array_of_members_Object: Array<{ email: string }> = [];

    members.map((member) => {
      array_of_members_Object.push({ email: member });
    });

    try {
      this.prisma.conversation.update({
        where: {
          id: conId,
        },
        data: {
          participants: {
            connect: array_of_members_Object,
          },
        },
      });
    } catch (error) {
      mapPrismaError(error);
    }
  }

  private async getOneConversationThroughPrisma(
    conversationId: string,
  ): Promise<Conversation | null> {
    return this.prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
    });
  }

  private async getManyConversationThroughPrisma(
    userId: string,
  ): Promise<Conversation[]> {
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

  private async createConversationThroughPrisma(
    userId: string,
    dto: CreateConversationDto,
  ): Promise<Conversation> {
    try {
      return this.prisma.conversation.create({
        data: {
          participants: {
            connect: [
              { id: userId },
              ...dto.members.map((email) => ({ email })),
            ],
          },
          owner: {
            connect: { id: userId },
          },
          name: dto.name,
        },
      });
    } catch (error) {
      mapPrismaError(error, 'creating-conversation');
    }
  }
}
