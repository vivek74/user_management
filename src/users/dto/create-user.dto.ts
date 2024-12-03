import { IsNotEmpty, IsEnum, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enum/role.enum';

export class CreateUserDto {
  @ApiProperty({
    example: 'newuser@example.com',
    description: 'The email address of the user',
    type: 'string',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: UserRole.VIEWER,
    description: 'The role of the user',
    enum: UserRole,
    type: 'string',
  })
  @IsEnum(UserRole)
  role: UserRole;
}
