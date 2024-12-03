import { Controller, Post, Get, Patch, Param, Body } from '@nestjs/common';
import { IngestionService } from './ingestion.service';

@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('trigger')
  async triggerIngestion(@Body('documentId') documentId: number) {
    return this.ingestionService.triggerIngestion(documentId);
  }

  @Get()
  async listIngestions() {
    return this.ingestionService.listIngestions();
  }

  @Get(':id')
  async getIngestionStatus(@Param('id') id: number) {
    return this.ingestionService.getIngestionStatus(id);
  }

  @Patch(':id/cancel')
  async cancelIngestion(@Param('id') id: number) {
    return this.ingestionService.cancelIngestion(id);
  }
}
