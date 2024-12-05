import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppModule } from 'src/app.module';
import { AuthModule } from 'src/auth/auth.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
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
        username: 'vvk',
        password: 'password123',
        email: 'vvk@admin.com',
        role: 'admin',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.status).toBe('success');
        expect(res.body.data).toHaveProperty('username');
      });
  });

  it('(POST /auth/register) Failed due to same username', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: 'vvk',
        password: 'password123',
        email: 'vvk@admin.com',
        role: 'admin',
      })
      .expect(409)
      .expect((res) => {
        expect(res.body.error).toBe('Conflict');
      });
  });

  it('(POST /auth/register) Failed due to same email', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: 'vvk1',
        password: 'password123',
        email: 'vvk@admin.com',
        role: 'admin',
      })
      .expect(409)
      .expect((res) => {
        expect(res.body.error).toBe('Conflict');
      });
  });

  it('(POST /auth/login) Success', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        password: 'password123',
        email: 'vvk@admin.com',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.status).toBe('success');
        expect(res.body.data).toHaveProperty('accessToken');
        expect(res.body.data).toHaveProperty('refreshToken');
        accessToken = res.body.data.accessToken;
        refreshToken = res.body.data.refreshToken;
      });
  });

  it('(POST /auth/login) Failed for wrong email', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        password: 'password123',
        email: 'vvk1@admin.com',
      })
      .expect(401)
      .expect((res) => {
        expect(res.body.error).toBe('Unauthorized');
      });
  });

  it('(POST /auth/refresh-token) Success', () => {
    return request(app.getHttpServer())
      .post('/auth/refresh-token')
      .send({
        refreshToken,
      })
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201)
      .expect((res) => {
        expect(res.body.status).toBe('success');
        expect(res.body.data).toHaveProperty('accessToken');
      });
  });

  it('(POST /auth/profile) Success', () => {
    return request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('success');
        expect(res.body.data).toHaveProperty('email');
      });
  });

  it('(POST /auth/profile) Failed', () => {
    return request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', '')
      .expect(401)
      .expect((res) => {
        expect(res.body.message).toBe('Unauthorized');
      });
  });

  it('(POST /auth/logout) Success', () => {
    return request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201)
      .expect((res) => {
        expect(res.body.status).toBe('success');
      });
  });
});
