import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestServiceModule } from './rest.module';
import { ConfigModule } from '@nestjs/config';
import { DocumentsModule } from './documents/documents.module';
import { IngestionModule } from './ingestion/ingestion.module';
import { PythonMockController } from './python-mock/python-mock.controller';
import { PythonMockModule } from './python-mock/python-mock.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RestServiceModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'admin',
      password: 'admin123',
      database: 'admin123',
      autoLoadEntities: true,
      synchronize: true,
    }),
    DocumentsModule,
    IngestionModule,
    PythonMockModule,
  ],
  controllers: [PythonMockController],
  providers: [],
})
export class AppModule {}
