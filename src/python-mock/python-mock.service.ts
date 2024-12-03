import { Injectable } from '@nestjs/common';

@Injectable()
export class PythonMockService {
  async ingestDocument(
    documentId: number,
  ): Promise<{ message: string; status: string }> {
    console.log(`Received ingestion request for document ID: ${documentId}`);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate success response
    return {
      message: `Ingestion for document ${documentId} started successfully`,
      status: 'in_progress',
    };
  }

  async handleCallback(
    jobId: number,
    status: string,
  ): Promise<{ message: string }> {
    console.log(
      `Callback received for job ID: ${jobId} with status: ${status}`,
    );
    return {
      message: `Callback for job ${jobId} processed successfully`,
    };
  }
}
