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
      destroy: jest.fn().mockResolvedValue({ result: 'ok' }), // Mock destroy
    },
  },
}));

describe('DocumentsController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let documentId: string;

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

  it('(POST /documents/upload) Success', async () => {
    const filePath = path.join(__dirname, 'file.jpeg');
    if (!fs.existsSync(filePath)) {
      throw new Error(`Test file not found at ${filePath}`);
    }

    return request(app.getHttpServer())
      .post('/documents/upload')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', filePath)
      .expect(201)
      .expect((res) => {
        expect(res.body.title).toBe('Title');
      });
  });

  it('(GET /documents) Success', async () => {
    return request(app.getHttpServer())
      .get('/documents')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body[1].id).toBe(`${documentId}`);
      });
  });

  it('(GET /documents/:id) Success', async () => {
    return request(app.getHttpServer())
      .get(`/documents/${documentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(`${documentId}`);
      });
  });

  it('(GET /documents/:id) Success', async () => {
    return request(app.getHttpServer())
      .get('/documents/754682b0-1ce0-4bf0-8bcd-123212406d51')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404)
      .expect((res) => {
        expect(res.body.message).toBe('Document not found or access denied');
      });
  });

  it('(PATCH /documents/:id) Success', () => {
    const filePath = path.join(__dirname, 'file.jpeg');
    if (!fs.existsSync(filePath)) {
      throw new Error(`Test file not found at ${filePath}`);
    }
    return request(app.getHttpServer())
      .patch(`/documents/${documentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .field('title', 'Sample Title')
      .field('description', 'Sample Description')
      .attach('file', filePath)
      .expect(200)
      .expect((res) => {
        expect(res.body.title).toBe('Sample Title');
      });
  });

  it('(DELETE /documents/:id) Success', async () => {
    return request(app.getHttpServer())
      .delete(`/documents/${documentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBe('Document deleted successfully');
      });
  });

  it('(DELETE /documents/:id) failed', async () => {
    return request(app.getHttpServer())
      .delete(`/documents/${documentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404)
      .expect((res) => {
        expect(res.body.message).toBe('Document not found or access denied');
      });
  });
});
