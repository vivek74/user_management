import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { EditUserRoleDto } from './dto/edit-user-role.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin')
  async listUsers() {
    return this.usersService.listUsers();
  }

  @Get(':id')
  @Roles('admin')
  async getUser(@Param('id') id: number) {
    return this.usersService.getUser(id);
  }

  @Post()
  @Roles('admin')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Patch(':id/role')
  @Roles('admin')
  async updateUserRole(
    @Param('id') id: number,
    @Body() editUserRoleDto: EditUserRoleDto,
  ) {
    return this.usersService.updateUserRole({ id, body: editUserRoleDto });
  }

  @Delete(':id')
  @Roles('admin')
  async deleteUser(@Param('id') id: number) {
    await this.usersService.deleteUser(id);
    return { message: 'User deleted successfully' };
  }
}
