import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma/client';
import { SignupDto } from 'src/common/dto';
import { mapPrismaError, mapUserError } from 'src/common/mapper';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({ where: { id } });
    } catch (error) {
      try {
        mapPrismaError(error);
      } catch (error) {
        mapUserError(error);
      }
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({ where: { email } });
    } catch (error) {
      try {
        mapPrismaError(error);
      } catch (error) {
        mapUserError(error);
      }
    }
  }

  async createUser(dto: SignupDto): Promise<User> {
    try {
      return await this.prisma.user.create({ data: dto });
    } catch (error) {
      try {
        mapPrismaError(error);
      } catch (error) {
        mapUserError(error);
      }
    }
  }
}
