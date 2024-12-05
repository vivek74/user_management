import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user', description: 'Add new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      example: {
        status: 'success',
        message: 'User registered successfully',
        data: {
          id: 1,
          username: 'johndoe',
          user: {
            email: 'johndoe@example.com',
            role: 'admin',
            id: 2,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation errors',
    schema: {
      example: {
        statusCode: 400,
        message: ['email must be an email', 'password is too short'],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Username already exists',
    schema: {
      example: {
        statusCode: 409,
        message: 'Username already exists',
        error: 'Conflict',
      },
    },
  })
  async register(@Body() registerAuthDto: RegisterAuthDto) {
    const data = await this.authService.register(registerAuthDto);
    return {
      status: 'success',
      message: 'User registered successfully',
      data,
    };
  }

  @Post('login')
  @ApiOperation({
    summary: 'Log in with credentials',
    description: 'Authenticate user with email and password',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        status: 'success',
        message: 'Login successful',
        data: {
          accessToken: '<JWT_ACCESS_TOKEN>',
          refreshToken: '<JWT_REFRESH_TOKEN>',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid email or password',
        error: 'Unauthorized',
      },
    },
  })
  @ApiBody({ type: LoginAuthDto })
  async login(@Body() loginAuthDto: LoginAuthDto) {
    const data = await this.authService.login(loginAuthDto);
    return {
      status: 'success',
      message: 'Login successful',
      data,
    };
  }

  @Post('refresh-token')
  @ApiOperation({
    summary: 'Refresh access token using refresh token',
    description: 'Refresh access token using refresh token',
  })
  @ApiResponse({
    status: 201,
    description: 'Token refreshed successfully',
    schema: {
      example: {
        status: 'success',
        message: 'Token refreshed successfully',
        data: {
          accessToken: '<JWT_ACCESS_TOKEN>',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    schema: {
      example: {
        statusCode: 400,
        message: ['refreshToken should not be empty'],
        error: 'Bad Request',
      },
    },
  })
  @ApiBearerAuth()
  @ApiBody({ type: RefreshTokenDto })
  @UseGuards(JwtAuthGuard)
  async refreshToken(@Body() body: RefreshTokenDto) {
    const data = await this.authService.refreshTokens(body.refreshToken);
    return {
      status: 'success',
      message: 'Token refreshed successfully',
      data,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Log out the current user', description: 'Log out' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Logged out successfully',
    schema: {
      example: {
        status: 'success',
        message: 'Logged out successfully',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Missing or invalid Authorization header',
  })
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req) {
    const userEmail = req.user.email;
    await this.authService.logout(userEmail);
    return { status: 'success', message: 'Logged out successfully' };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get the profile of the authenticated user' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
    schema: {
      example: {
        status: 'success',
        message: 'Profile retrieved successfully',
        data: {
          id: 1,
          username: 'John',
          email: 'john@admin.com',
          role: 'admin',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access' })
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req) {
    const data = await this.authService.getProfile(req.user.email);
    return {
      status: 'success',
      message: 'Profile retrieved successfully',
      data: { ...data.user },
    };
  }
}
