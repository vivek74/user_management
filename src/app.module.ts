import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestServiceModule } from './rest.module';
import { ConfigModule } from '@nestjs/config';
import { DocumentsModule } from './documents/documents.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
