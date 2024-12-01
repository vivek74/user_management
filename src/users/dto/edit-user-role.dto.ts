import { IsEnum } from 'class-validator';
import { UserRole } from '../enum/role.enum';

export class EditUserRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}
