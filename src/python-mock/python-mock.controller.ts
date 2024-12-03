import { Controller, Post, Body } from '@nestjs/common';
import { PythonMockService } from './python-mock.service';

@Controller('python-mock')
export class PythonMockController {
  constructor(private readonly pythonMockService: PythonMockService) {}

  @Post('ingest')
  async ingestDocument(@Body('documentId') documentId: number) {
    return this.pythonMockService.ingestDocument(documentId);
  }

  @Post('callback')
  async sendCallback(@Body() body: { jobId: number; status: string }) {
    return this.pythonMockService.handleCallback(body.jobId, body.status);
  }
}
