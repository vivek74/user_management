import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppModule } from 'src/app.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

interface User {
  id: number;
  email: string;
  role: string;
}

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  let accessToken: string;
  let user: User;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule, UsersModule, AuthModule],
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
        username: 'vvk_users',
        password: 'password123',
        email: 'vvk_users@admin.com',
        role: 'admin',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.status).toBe('success');
        expect(res.body.data).toHaveProperty('username');
        user = {
          id: res.body.data.user.id,
          email: res.body.data.user.email,
          role: res.body.data.user.role,
        };
      });
  });

  it('(POST /auth/login) Success', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        password: 'password123',
        email: 'vvk_users@admin.com',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.status).toBe('success');
        expect(res.body.data).toHaveProperty('accessToken');
        expect(res.body.data).toHaveProperty('refreshToken');
        accessToken = res.body.data.accessToken;
      });
  });

  it('(GET /users) Success', () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('success');
      });
  });

  it('(GET /users/:id) Success', () => {
    return request(app.getHttpServer())
      .get(`/users/${user.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('success');
      });
  });

  it('(POST /users) Success', () => {
    return request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: 'newUser@gmial.com',
        role: 'viewer',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.data).toHaveProperty('email');
        expect(res.body.data).toHaveProperty('role');
        expect(res.body.data).toHaveProperty('password');
      });
  });

  it('(POST /users) Failed due to same user email', () => {
    return request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: 'newUser@gmial.com',
        role: 'viewer',
      })
      .expect(409)
      .expect((res) => {
        expect(res.body.message).toBe('Email already exists');
      });
  });

  it('(PATCH /users/:id/role) Success', () => {
    return request(app.getHttpServer())
      .patch(`/users/${user.id}/role`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        role: 'admin',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('success');
        expect(res.body.message).toBe("User's role updated successfully");
        expect(res.body.data).toHaveProperty('email');
        expect(res.body.data).toHaveProperty('id');
      });
  });

  it('(DELETE /users/:id) Failed due to invalid user id', () => {
    return request(app.getHttpServer())
      .delete('/users/b45ec2bd-1387-42a2-920b-c3fb2f113419')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404)
      .expect((res) => {
        expect(res.body.message).toBe('User not found');
      });
  });

  it('(DELETE /users/:id) Success', () => {
    return request(app.getHttpServer())
      .delete(`/users/${user.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('success');
      });
  });
});
