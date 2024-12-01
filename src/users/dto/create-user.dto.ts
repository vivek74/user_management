import { IsNotEmpty, IsEnum, IsEmail } from 'class-validator';
import { UserRole } from '../enum/role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsEnum(UserRole)
  role: UserRole;
}
