import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/models/user.entity';
import { AuthEntity } from './models/auth.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    // Explicitly verify the access token
    try {
      this.jwtService.verify(accessToken, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
    } catch /* istanbul ignore next */ {
      throw new UnauthorizedException('Invalid or expired access token');
    }

    // Fetch the user based on the payload `sub` (user ID)
    const auth = await this.authRepository.findOne({
      where: { id: payload.sub },
      relations: ['user'],
    });

    /* istanbul ignore if */
    if (!auth.user) {
      throw new UnauthorizedException('Invalid or expired access token');
    }

    // Verify if the user has logged out by checking the refreshToken
    /* istanbul ignore if */
    if (!auth.refreshToken) {
      throw new UnauthorizedException('Invalid or expired access token');
    }

    /* istanbul ignore if */
    if (accessToken !== auth.accessToken) {
      throw new UnauthorizedException('Invalid or expired access token');
    }

    return {
      id: auth.user.id,
      username: auth.username,
      role: auth.user.role,
      refreshToken: auth.refreshToken,
    };
  }
}
