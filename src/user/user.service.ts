import { HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { SignupDto } from 'src/common/dto';
import { UserNotFoundException } from 'src/common/exceptions';
import { User } from 'generated/prisma/client';

@Injectable()
export class UserService {
  constructor(private repo: UserRepository) {}

  async findById(id: string): Promise<User> {
    const user = await this.repo.findById(id);
    if (!user)
      throw new UserNotFoundException(
        'User not found',
        'USER_NOT_FOUND',
        HttpStatus.NOT_FOUND,
        `No user with the given ID ${id} exists`,
      );
    return user;
  }

  async findByEmail(email: string): Promise<User> {

    const user = await this.repo.findByEmail(email);

    if (!user)
      throw new UserNotFoundException(
        'User not found',
        'USER_NOT_FOUND',
        HttpStatus.NOT_FOUND,
        `No user with the given email ${email} exists`,
      );
    return user;
  }

  async createUser(dto: SignupDto): Promise<User> {
    return await this.repo.createUser(dto);
  }
  
  async updateProfile(userId: string, dto: Partial<SignupDto>): Promise<User> {
    return {} as User; // Implementation pending
  }
}