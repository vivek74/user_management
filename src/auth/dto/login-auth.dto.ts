import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginAuthDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the user',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user (minimum 6 characters)',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
