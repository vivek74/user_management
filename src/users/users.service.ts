import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './models/user.entity';
import { AuthEntity } from 'src/auth/models/auth.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { EditUserRoleDto } from './dto/edit-user-role.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
  ) {}

  async listUsers(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async getUser(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createUser({ email, role }: CreateUserDto): Promise<any> {
    // Check if the email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Generate a random password (you can set your own logic for this)
    const password = Math.random().toString(36).slice(-8); // Random 8-character string

    // Create the user entity
    const user = this.userRepository.create({ email, role });
    const savedUser = await this.userRepository.save(user);

    // Create the associated auth entity
    const auth = new AuthEntity();
    auth.username = email;
    auth.password = password;
    auth.user = savedUser;

    await this.authRepository.save(auth);

    // Return the new user details along with the plain password (for admin to share with the user)
    return {
      id: savedUser.id,
      email: savedUser.email,
      role: savedUser.role,
      password,
    };
  }

  async updateUserRole({
    body,
    id,
  }: {
    body: EditUserRoleDto;
    id: number;
  }): Promise<UserEntity> {
    const user = await this.getUser(id);
    user.role = body.role;
    return this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.getUser(id);
    await this.userRepository.remove(user);
  }
}
