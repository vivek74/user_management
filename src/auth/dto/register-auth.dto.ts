import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsEnum,
} from 'class-validator';
import { UserRole } from 'src/users/enum/role.enum';

export class RegisterAuthDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsEnum(UserRole)
  role: UserRole;
}
