import { Injectable } from '@nestjs/common';
import { LoginDto } from 'src/common/dto';
import { SignupDto } from 'src/common/dto/signup.dto';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {

  constructor(private readonly authRepo: AuthRepository) { }

  async signup(dto: SignupDto): Promise<{ token: string; }> {

    // 1. Create User
    const user = await this.authRepo.createUser(dto);

    // 2. Generate Token
    const token = await this.authRepo.signToken(user);

    // Finally return the token
    return { token };
  }

  async signin(dto: LoginDto): Promise<{ token: string }> {

    // 1. Find the user by email
    const user = await this.authRepo.validateUser(dto);

    // 2. Generate Token
    const token = await this.authRepo.signToken(user);

    // Finally return the token
    return { token };
  }

}
