import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/films/ (GET) — список фильмов', () => {
    return request(app.getHttpServer())
      .get('/films/')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body.items)).toBe(true);
        expect(res.body.total).toBe(res.body.items.length);
      });
  });
});
