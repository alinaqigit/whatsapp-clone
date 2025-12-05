import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { UserNotFoundException } from 'src/common/exceptions';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private config: ConfigService,
    private user: UserService,
  ) {
    // Configure the strategy
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: { sub: string; email: string }) {
    // Use the utility service to find the user by ID
    try {
      const user = await this.user.findById(payload.sub);

      // If user is found, return the user object (or relevant info)
      const { password, ...result } = user; // Exclude password from the returned user object
      return result;
    } catch (error) {
      if (error instanceof UserNotFoundException)
        throw new UnauthorizedException('Invalid token or user does not exist');
    }
  }
}
