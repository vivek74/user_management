import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
import { AppModule } from 'src/app.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { IngestionModule } from 'src/ingestion/ingestion.module';
import { PythonMockModule } from 'src/python-mock/python-mock.module';
import { DocumentsModule } from 'src/documents/documents.module';

jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn().mockResolvedValue({
        public_id: 'mocked-public-id',
        secure_url: 'https://mocked-url.com/test-file.jpeg',
      }),
      upload_stream: jest.fn((options, callback) => {
        callback(null, {
          public_id: 'mocked-public-id',
          secure_url: 'https://mocked-url.com/test-file.jpeg',
        });
      }),
    },
  },
}));

describe('IngestionController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let documentId: string;
  let ingestionId: string;

  let accessToken: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        AppModule,
        UsersModule,
        AuthModule,
        IngestionModule,
        PythonMockModule,
        DocumentsModule,
      ],
    }).compile();
    app = module.createNestApplication();
    dataSource = module.get<DataSource>(DataSource);
    await app.init();
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await app.close();
  });

  it('(POST /auth/register) Success', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: 'vvk_ingestion',
        password: 'password123',
        email: 'vvk_ingestion@admin.com',
        role: 'admin',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.status).toBe('success');
        expect(res.body.data).toHaveProperty('username');
      });
  });

  it('(POST /auth/login) Success', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        password: 'password123',
        email: 'vvk_ingestion@admin.com',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.status).toBe('success');
        expect(res.body.data).toHaveProperty('accessToken');
        expect(res.body.data).toHaveProperty('refreshToken');
        accessToken = res.body.data.accessToken;
      });
  });

  it('(POST /documents/upload) Success', async () => {
    const filePath = path.join(__dirname, 'file.jpeg');
    if (!fs.existsSync(filePath)) {
      throw new Error(`Test file not found at ${filePath}`);
    }

    return request(app.getHttpServer())
      .post('/documents/upload')
      .set('Authorization', `Bearer ${accessToken}`)
      .field('title', 'Sample Title')
      .field('description', 'Sample Description')
      .attach('file', filePath)
      .expect(201)
      .expect((res) => {
        expect(res.body.title).toBe('Sample Title');
        documentId = res.body.id;
      });
  });

  it('(POST /ingestion/trigger) Success', () => {
    return request(app.getHttpServer())
      .post('/ingestion/trigger')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        documentId,
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.status).toBe('success');
        expect(res.body.data.status).toBe('in_progress');
      });
  });

  it('(POST /ingestion/trigger) Success', () => {
    return request(app.getHttpServer())
      .post('/ingestion/trigger')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        documentId: '754682b0-1ce0-4bf0-8bcd-123212406d51',
      })
      .expect(404)
      .expect((res) => {
        expect(res.body.message).toBe('Document not found');
      });
  });

  it('(GET /ingestion) Success', () => {
    return request(app.getHttpServer())
      .get('/ingestion')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('success');
        expect(res.body.data[0]).toHaveProperty('status');
        ingestionId = res.body.data[0].id;
      });
  });

  it('(GET /ingestion/:id) Success', () => {
    return request(app.getHttpServer())
      .get(`/ingestion/${ingestionId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('success');
        expect(res.body.data).toHaveProperty('status');
      });
  });

  it('(GET /ingestion/:id) Success', () => {
    return request(app.getHttpServer())
      .get('/ingestion/754682b0-1ce0-4bf0-8bcd-123212406d51')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect((res) => {
        expect(res.body.message).toBe('Ingestion job not found');
      });
  });

  it('(PATCH /ingestion/:id/cancel) Success', () => {
    return request(app.getHttpServer())
      .patch(`/ingestion/${ingestionId}/cancel`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('success');
        expect(res.body.data).toHaveProperty('status');
      });
  });

  it('(POST /python-mock/ingest) Success', () => {
    return request(app.getHttpServer())
      .post('/python-mock/ingest')
      .send({ documentId })
      .expect(201)
      .expect((res) => {
        expect(res.body.message).toBe(
          `Ingestion for document ${documentId} started successfully`,
        );
      });
  });
});
