import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
import { AuthEntity } from './models/auth.entity';
import { UserEntity } from 'src/users/models/user.entity';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async register({
    email,
    password,
    role,
    username,
  }: RegisterAuthDto): Promise<AuthEntity> {
    // Check if username already exists
    const existingAuth = await this.authRepository.findOne({
      where: { username },
    });
    if (existingAuth) {
      throw new ConflictException('Username already exists');
    }

    // Check if email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Create a new user
    const user = new UserEntity();
    user.email = email;
    user.role = role;

    const savedUser = await this.userRepository.save(user);

    // Create authentication details linked to the user
    const auth = new AuthEntity();
    auth.username = username;
    auth.password = password;
    auth.user = savedUser;

    const savedAuth = await this.authRepository.save(auth);

    return plainToInstance(AuthEntity, savedAuth);
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<AuthEntity | null> {
    const user = await this.authRepository.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login({ email, password }: LoginAuthDto) {
    const auth = await this.authRepository.findOne({
      where: { user: { email } },
      relations: ['user'],
    });

    if (!auth || !(await bcrypt.compare(password, auth.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      username: auth.username,
      sub: auth.id,
      role: auth.user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: 'your-access-token-secret',
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: 'your-refresh-token-secret',
      expiresIn: '7d',
    });

    auth.refreshToken = refreshToken;
    await this.authRepository.save(auth);

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: 'your-refresh-token-secret',
      });

      const user = await this.authRepository.findOne({
        where: { id: payload.sub, refreshToken },
      });
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = this.jwtService.sign(
        { username: user.username, sub: user.id, role: user.user.role },
        {
          secret: 'your-access-token-secret',
          expiresIn: '15m',
        },
      );

      return { accessToken: newAccessToken };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(accessToken: string, refreshToken: string) {
    try {
      const payload = this.jwtService.verify(accessToken, {
        secret: 'your-access-token-secret',
      });

      const auth = await this.authRepository.findOne({
        where: { id: payload.sub, refreshToken: refreshToken },
      });

      if (!auth) {
        throw new UnauthorizedException('Invalid tokens');
      }

      // Invalidate the refresh token by clearing it in the database
      auth.refreshToken = null;
      await this.authRepository.save(auth);
    } catch {
      throw new UnauthorizedException('Invalid or expired tokens');
    }
  }
}
