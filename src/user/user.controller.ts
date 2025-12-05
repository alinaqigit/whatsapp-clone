import { ClassSerializerInterceptor, Controller, Get, Patch, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserEntity } from 'src/common/entities';
import { JwtGuard } from 'src/common/guards';
import type { User } from 'generated/prisma/client';
import { GetUser } from 'src/common/decorators';
import { UserUpdateDto } from 'src/common/dto';
import { UserService } from './user.service';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor( private readonly userService: UserService ) { }

  @Get('profile')
  getProfile(@GetUser() user: User): UserEntity {
    return new UserEntity(user);
  }

  @Patch('profile')
  updateProfile(@GetUser('id') userId: string, dto: UserUpdateDto): Promise<User> {
    return this.userService.updateProfile(userId, dto );
  }
}