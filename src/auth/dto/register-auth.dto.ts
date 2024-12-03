import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/users/enum/role.enum';

export class RegisterAuthDto {
  @ApiProperty({
    example: 'john',
    description: 'The username of the user',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user (minimum 6 characters)',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'The email address of the user',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: UserRole.ADMIN,
    description: 'The role of the user',
    enum: UserRole,
  })
  @IsEnum(UserRole)
  role: UserRole;
}
