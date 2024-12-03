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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UploadDocumentDto } from './dto/upload-document.dto';

@ApiTags('Documents')
@ApiBearerAuth()
@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @ApiOperation({
    summary: 'Upload a document',
    description:
      'Allows users to upload a document file along with optional metadata.',
  })
  @ApiBody({
    description: 'Document metadata and file',
    type: UploadDocumentDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Document uploaded successfully',
    schema: {
      example: {
        status: 'success',
        message: 'Document uploaded successfully',
        data: {
          id: 1,
          title: 'My Document',
          description: 'This is a sample document',
          cloudinaryPublicId: 'documents/z9jvtrvi4oucdcuqayzh',
          cloudinaryUrl: 'https://cloudinary.com/my-document',
          user: { id: 1, email: 'user@example.com', role: 'admin' },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation errors',
  })
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
  @ApiOperation({
    summary: 'List documents',
    description: 'Retrieve all documents for the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Documents retrieved successfully',
    schema: {
      example: {
        status: 'success',
        message: 'Documents retrieved successfully',
        data: [
          {
            id: 1,
            title: 'photo',
            description: 'Uploaded document',
            cloudinaryPublicId: 'documents/z9jvtrvi4oucdcuqayzh',
            cloudinaryUrl:
              'https://res.cloudinary.com/drcgparug/image/upload/v1733242309/documents/z9jvtrvi4oucdcuqayzh.jpg',
            createdAt: '2024-12-03T16:11:50.666Z',
          },
          {
            id: 2,
            title: 'photo',
            description: 'Uploaded document',
            cloudinaryPublicId: 'documents/z9jvtrvi4oucdcuqayzh',
            cloudinaryUrl:
              'https://res.cloudinary.com/drcgparug/image/upload/v1733242309/documents/z9jvtrvi4oucdcuqayzh.jpg',
            createdAt: '2024-12-03T16:11:50.666Z',
          },
        ],
      },
    },
  })
  async listDocuments(@Req() req) {
    const userId = req.user.id;
    return this.documentsService.listDocuments(userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get document details',
    description: 'Retrieve the details of a specific document by its ID.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the document', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Document retrieved successfully',
    schema: {
      example: {
        status: 'success',
        message: 'Document retrieved successfully',
        data: {
          id: 1,
          title: 'photo',
          description: 'Uploaded document',
          cloudinaryPublicId: 'documents/z9jvtrvi4oucdcuqayzh',
          cloudinaryUrl:
            'https://res.cloudinary.com/drcgparug/image/upload/v1733242309/documents/z9jvtrvi4oucdcuqayzh.jpg',
          createdAt: '2024-12-03T16:11:50.666Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Document not found',
    schema: {
      example: {
        status: 'error',
        message: 'Document not found',
      },
    },
  })
  async getDocument(@Param('id') id: number, @Req() req) {
    const userId = req.user.id;
    return this.documentsService.getDocument(id, userId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update document',
    description: 'Update the metadata or file of an existing document.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the document to update',
    example: 1,
  })
  @ApiBody({
    description: 'Updated metadata for the document',
    type: UploadDocumentDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Document updated successfully',
    schema: {
      example: {
        status: 'success',
        message: 'Document updated successfully',
        data: {
          id: 1,
          title: 'photo',
          description: 'Uploaded document',
          cloudinaryPublicId: 'documents/z9jvtrvi4oucdcuqayzh',
          cloudinaryUrl:
            'https://res.cloudinary.com/drcgparug/image/upload/v1733242309/documents/z9jvtrvi4oucdcuqayzh.jpg',
          createdAt: '2024-12-03T16:11:50.666Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Document not found',
  })
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
  @ApiOperation({
    summary: 'Delete a document',
    description: 'Delete a document by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the document to delete',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Document deleted successfully',
    schema: {
      example: {
        status: 'success',
        message: 'Document deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Document not found',
    schema: {
      example: {
        status: 'error',
        message: 'Document not found',
      },
    },
  })
  async deleteDocument(@Param('id') id: number, @Req() req) {
    const userId = req.user.id;
    return this.documentsService.deleteDocument(id, userId);
  }
}
