import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { UserRole } from '../enum/role.enum';
import { AuthEntity } from 'src/auth/models/auth.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.VIEWER,
  })
  role: UserRole;

  @OneToOne(() => AuthEntity, (auth) => auth.user)
  auth: AuthEntity;
}
