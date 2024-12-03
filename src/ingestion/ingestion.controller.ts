import { Controller, Post, Get, Patch, Param, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { IngestionService } from './ingestion.service';

@ApiTags('Ingestion')
@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('trigger')
  @ApiOperation({
    summary: 'Trigger ingestion',
    description: 'Initiate the ingestion process for a specified document.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        documentId: {
          type: 'number',
          description: 'The ID of the document to ingest',
          example: 1,
        },
      },
      required: ['documentId'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Ingestion process started successfully',
    schema: {
      example: {
        status: 'success',
        message: 'Ingestion process started successfully',
        data: {
          status: 'in_progress',
          document: {
            id: 1,
            title: 'My Document',
            description: 'This is a sample document',
            cloudinaryPublicId: 'documents/z9jvtrvi4oucdcuqayzh',
            cloudinaryUrl:
              'https://res.cloudinary.com/drcgparug/image/upload/v1733242309/documents/z9jvtrvi4oucdcuqayzh.jpg',
            createdAt: '2024-12-03T16:11:50.666Z',
          },
          error: null,
          updatedAt: null,
          id: 2,
          createdAt: '2024-12-03T16:26:33.402Z',
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
  async triggerIngestion(@Body('documentId') documentId: number) {
    const data = await this.ingestionService.triggerIngestion(documentId);
    return {
      status: 'success',
      message: 'Ingestion process started successfully',
      data,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'List all ingestions',
    description: 'Retrieve a list of all ingestion processes.',
  })
  @ApiResponse({
    status: 200,
    description: 'Ingestions retrieved successfully',
    schema: {
      example: {
        status: 'success',
        message: 'Ingestions retrieved successfully',
        data: [
          {
            id: 1,
            status: 'canceled',
            error: null,
            createdAt: '2024-12-03T16:24:32.994Z',
            updatedAt: null,
            document: {
              id: 1,
              title: 'My Document',
              description: 'This is a sample document',
              cloudinaryPublicId: 'documents/z9jvtrvi4oucdcuqayzh',
              cloudinaryUrl:
                'https://res.cloudinary.com/drcgparug/image/upload/v1733242309/documents/z9jvtrvi4oucdcuqayzh.jpg',
              createdAt: '2024-12-03T16:11:50.666Z',
            },
          },
          {
            id: 2,
            status: 'in_progress',
            error: null,
            createdAt: '2024-12-03T16:26:33.402Z',
            updatedAt: null,
            document: {
              id: 1,
              title: 'My Document',
              description: 'This is a sample document',
              cloudinaryPublicId: 'documents/z9jvtrvi4oucdcuqayzh',
              cloudinaryUrl:
                'https://res.cloudinary.com/drcgparug/image/upload/v1733242309/documents/z9jvtrvi4oucdcuqayzh.jpg',
              createdAt: '2024-12-03T16:11:50.666Z',
            },
          },
        ],
      },
    },
  })
  async listIngestions() {
    const data = await this.ingestionService.listIngestions();
    return {
      status: 'success',
      message: 'Ingestions retrieved successfully',
      data,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get ingestion status',
    description:
      'Retrieve the status of a specific ingestion process by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the ingestion job',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Ingestion status retrieved successfully',
    schema: {
      example: {
        status: 'success',
        message: 'Ingestion status retrieved successfully',
        data: {
          id: 1,
          status: 'in_progress',
          document: {
            id: 1,
            title: 'Sample Document',
          },
          createdAt: '2024-12-03T12:00:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Ingestion job not found',
    schema: {
      example: {
        status: 'error',
        message: 'Ingestion job not found',
      },
    },
  })
  async getIngestionStatus(@Param('id') id: number) {
    const data = await this.ingestionService.getIngestionStatus(id);
    return {
      status: 'success',
      message: 'Ingestion status retrieved successfully',
      data,
    };
  }

  @Patch(':id/cancel')
  @ApiOperation({
    summary: 'Cancel ingestion',
    description: 'Cancel an ongoing ingestion process by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the ingestion job to cancel',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Ingestion process canceled successfully',
    schema: {
      example: {
        status: 'success',
        message: 'Ingestion process canceled successfully',
        data: {
          id: 1,
          status: 'canceled',
          document: {
            id: 1,
            title: 'Sample Document',
          },
          updatedAt: '2024-12-03T12:30:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Ingestion job not found or cannot be canceled',
    schema: {
      example: {
        status: 'error',
        message: 'Ingestion job not found or cannot be canceled',
      },
    },
  })
  async cancelIngestion(@Param('id') id: number) {
    const data = await this.ingestionService.cancelIngestion(id);
    return {
      status: 'success',
      message: 'Ingestion process canceled successfully',
      data,
    };
  }
}
