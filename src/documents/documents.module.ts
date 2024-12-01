import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { UserEntity } from 'src/users/models/user.entity';
import { DocumentEntity } from './models/document.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEntity } from 'src/auth/models/auth.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, AuthEntity, DocumentEntity]),
    CloudinaryModule,
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
