import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IngestionEntity } from './models/ingestion.entity';
import { DocumentEntity } from 'src/documents/models/document.entity';

@Injectable()
export class IngestionService {
  constructor(
    @InjectRepository(IngestionEntity)
    private readonly ingestionRepository: Repository<IngestionEntity>,
    @InjectRepository(DocumentEntity)
    private readonly documentRepository: Repository<DocumentEntity>,
    private readonly httpService: HttpService,
  ) {}

  async triggerIngestion(documentId: number): Promise<IngestionEntity> {
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
    });
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    const ingestion = this.ingestionRepository.create({
      document,
      status: 'pending',
    });
    await this.ingestionRepository.save(ingestion);

    try {
      const response = await firstValueFrom(
        this.httpService.post('http://localhost:9001/python-mock/ingest', {
          documentId,
        }),
      );

      ingestion.status = response.data.status;
    } catch (error) {
      ingestion.status = 'failed';
      ingestion.error = error.message;
    }

    return this.ingestionRepository.save(ingestion);
  }

  async listIngestions(): Promise<IngestionEntity[]> {
    return this.ingestionRepository.find({ relations: ['document'] });
  }

  async getIngestionStatus(id: number): Promise<IngestionEntity> {
    const ingestion = await this.ingestionRepository.findOne({
      where: { id },
      relations: ['document'],
    });
    if (!ingestion) {
      throw new NotFoundException('Ingestion job not found');
    }
    return ingestion;
  }

  async cancelIngestion(id: number): Promise<IngestionEntity> {
    const ingestion = await this.getIngestionStatus(id);

    if (ingestion.status !== 'in_progress') {
      throw new NotFoundException(
        'Cannot cancel a job that is not in progress',
      );
    }

    ingestion.status = 'canceled';
    return this.ingestionRepository.save(ingestion);
  }
}
