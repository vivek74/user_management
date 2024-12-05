import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { PythonMockService } from './python-mock.service';

@ApiTags('Python Mock')
@Controller('python-mock')
export class PythonMockController {
  constructor(private readonly pythonMockService: PythonMockService) {}

  @Post('ingest')
  @ApiOperation({
    summary: 'Ingest a document',
    description: 'Simulate triggering the ingestion process for a document.',
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
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Document ingestion triggered successfully',
    schema: {
      example: {
        status: 'success',
        message: 'Ingestion process triggered',
        data: {
          jobId: 123,
          status: 'IN_PROGRESS',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid document ID',
    schema: {
      example: {
        status: 'error',
        message: 'Invalid document ID',
      },
    },
  })
  async ingestDocument(@Body('documentId') documentId: number) {
    return this.pythonMockService.ingestDocument(documentId);
  }
}
