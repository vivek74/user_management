import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { DocumentsModule } from 'src/documents/documents.module';
import { IngestionModule } from 'src/ingestion/ingestion.module';
import { PythonMockModule } from 'src/python-mock/python-mock.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    DocumentsModule,
    IngestionModule,
    PythonMockModule,
  ],
})
export class RestServiceModule {}
