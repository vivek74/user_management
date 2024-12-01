import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Req,
  UseGuards,
  Get,
  Param,
  Patch,
  Body,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UploadDocumentDto } from './dto/upload-document.dto';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
    @Body() body: UploadDocumentDto,
  ) {
    const userId = req.user.id;
    return this.documentsService.uploadDocument(userId, file, body);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async listDocuments(@Req() req) {
    const userId = req.user.id;
    return this.documentsService.listDocuments(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getDocument(@Param('id') id: number, @Req() req) {
    const userId = req.user.id;
    return this.documentsService.getDocument(id, userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateDocument(
    @Param('id') id: number,
    @Body() body: UploadDocumentDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    const userId = req.user.id;
    const { title, description } = body;
    return this.documentsService.updateDocument(
      id,
      userId,
      title,
      description,
      file,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteDocument(@Param('id') id: number, @Req() req) {
    const userId = req.user.id;
    return this.documentsService.deleteDocument(id, userId);
  }
}
