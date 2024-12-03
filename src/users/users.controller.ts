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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { EditUserRoleDto } from './dto/edit-user-role.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin')
  @ApiOperation({
    summary: 'List all users',
    description: 'Retrieve all users',
  })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    schema: {
      example: {
        status: 'success',
        message: 'Users retrieved successfully',
        data: [
          {
            id: 1,
            email: 'admin@example.com',
            role: 'admin',
          },
          {
            id: 2,
            email: 'editor@example.com',
            role: 'editor',
          },
        ],
      },
    },
  })
  async listUsers() {
    const data = await this.usersService.listUsers();
    return {
      status: 'success',
      message: 'Users retrieved successfully',
      data,
    };
  }

  @Get(':id')
  @Roles('admin')
  @ApiOperation({
    summary: 'Get a user by ID',
    description: 'Retrieve user details',
  })
  @ApiParam({ name: 'id', description: 'The ID of the user', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    schema: {
      example: {
        status: 'success',
        message: 'User retrieved successfully',
        data: {
          id: 1,
          email: 'admin@example.com',
          role: 'admin',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        status: 'error',
        message: 'User not found',
      },
    },
  })
  async getUser(@Param('id') id: number) {
    const data = await this.usersService.getUser(id);
    return {
      status: 'success',
      message: 'User retrieved successfully',
      data,
    };
  }

  @Post()
  @Roles('admin')
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Add a new user to the system',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    schema: {
      example: {
        status: 'success',
        message: 'User created successfully',
        data: {
          id: 3,
          email: 'newuser@example.com',
          role: 'viewer',
        },
      },
    },
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    const data = await this.usersService.createUser(createUserDto);
    return {
      status: 'success',
      message: 'User created successfully',
      data,
    };
  }

  @Patch(':id/role')
  @Roles('admin')
  @ApiOperation({
    summary: "Update a user's role",
    description: "Edit a user's role",
  })
  @ApiParam({ name: 'id', description: 'The ID of the user', example: 1 })
  @ApiBody({ type: EditUserRoleDto })
  @ApiResponse({
    status: 200,
    description: "User's role updated successfully",
    schema: {
      example: {
        status: 'success',
        message: "User's role updated successfully",
        data: {
          id: 1,
          email: 'admin@example.com',
          role: 'editor',
        },
      },
    },
  })
  async updateUserRole(
    @Param('id') id: number,
    @Body() editUserRoleDto: EditUserRoleDto,
  ) {
    const data = await this.usersService.updateUserRole({
      id,
      body: editUserRoleDto,
    });
    return {
      status: 'success',
      message: "User's role updated successfully",
      data,
    };
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({
    summary: 'Delete a user',
    description: 'Remove a user from the system',
  })
  @ApiParam({ name: 'id', description: 'The ID of the user', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    schema: {
      example: {
        status: 'success',
        message: 'User deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        status: 'error',
        message: 'User not found',
      },
    },
  })
  async deleteUser(@Param('id') id: number) {
    await this.usersService.deleteUser(id);
    return {
      status: 'success',
      message: 'User deleted successfully',
    };
  }
}
