import { Injectable } from '@nestjs/common';

@Injectable()
export class PythonMockService {
  async ingestDocument(
    documentId: number,
  ): Promise<{ message: string; status: string }> {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate success response
    return {
      message: `Ingestion for document ${documentId} started successfully`,
      status: 'in_progress',
    };
  }
}
