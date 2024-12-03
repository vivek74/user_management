import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enum/role.enum';

export class EditUserRoleDto {
  @ApiProperty({
    example: UserRole.ADMIN,
    description: 'The new role to assign to the user',
    enum: UserRole,
    type: 'string',
  })
  @IsEnum(UserRole)
  role: UserRole;
}
