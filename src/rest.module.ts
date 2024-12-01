import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { DocumentsModule } from 'src/documents/documents.module';

@Module({
  imports: [AuthModule, UsersModule, DocumentsModule],
})
export class RestServiceModule {}
