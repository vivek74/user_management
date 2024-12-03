import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthEntity } from './models/auth.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: any) {
    const auth = await this.authRepository.findOne({
      where: { id: payload.sub },
      relations: ['user'],
    });

    if (!auth) {
      throw new UnauthorizedException('Invalid token');
    }

    return {
      id: auth.id,
      username: auth.username,
      email: auth.user.email,
      role: auth.user.role,
    };
  }
}
