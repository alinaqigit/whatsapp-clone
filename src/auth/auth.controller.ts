import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto } from 'src/common/dto';

@Controller('auth')
export class AuthController {

  constructor(private readonly auth: AuthService) { }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signup(@Body() dto: SignupDto): Promise<{ token: string }> {
    return this.auth.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: LoginDto): Promise<{ token: string }> {
    return this.auth.signin(dto);
  }
}
