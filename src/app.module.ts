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
      type: process.env.TYPE as 'postgres' | 'sqlite',
      host: process.env.HOST,
      port: Number(process.env.PORT),
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
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
