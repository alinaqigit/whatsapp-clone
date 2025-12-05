import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'generated/prisma/client';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';
import { LoginDto, SignupDto } from 'src/common/dto';
import {
  InvalidCredentialsException,
  UserAlreadyExistsException,
  UserNotFoundException,
} from 'src/common/exceptions';

@Injectable()
export class AuthRepository {
  constructor(
    private jwt: JwtService,
    private user: UserService,
  ) {}

  async createUser(dto: SignupDto): Promise<User> {
    // Create user logic

    const Hash = await argon2.hash(dto.password);

    try {
      
      const user = await this.user.createUser({
        email: dto.email,
        password: Hash,
      });
  
      return user;
    } catch (error) {
      if ( error instanceof UserAlreadyExistsException ) 
        throw new UserAlreadyExistsException(
          'User with this email already exists',
          'USER_ALREADY_EXISTS',
          HttpStatus.CONFLICT,
        );
        
      if (error instanceof InvalidCredentialsException)
        throw new InvalidCredentialsException(
          'Invalid credentials',
          'INVALID_CREDENTIALS',
          HttpStatus.UNAUTHORIZED,
        );
      
      throw error;
    }
  }

  async signToken(user: User): Promise<string> {
    // Logic to generate a JWT token for the user
    return this.jwt.sign({ sub: user.id, email: user.email });
  }

  async validateUser(dto: LoginDto): Promise<User> {
    // Logic to find and validate user by email

    // 1 Extract user
    let user: User
    try {
      user = await this.user.findByEmail(dto.email);
      
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new UserNotFoundException(
          'User Not found',
          'USER_NOT_FOUND',
          HttpStatus.UNAUTHORIZED,
        );
      }
      throw error;
    }

    // 2. Check if user exists
    if (!user)
      throw new UserNotFoundException(
        'User Not found',
        'USER_NOT_FOUND',
        HttpStatus.UNAUTHORIZED,
      );

    // 3. Check if password is correct
    const isPasswordValid = await argon2.verify(
      user.password,
      dto.password,
    );

    if (!isPasswordValid)
      throw new InvalidCredentialsException(
        'Password is incorrect',
        'INVALID_CREDENTIALS',
        HttpStatus.UNAUTHORIZED,
        'user tried to login with wrong password',
      );

    // 4. Return user
    return user;
  }
}
