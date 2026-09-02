import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { setupOpenApi } from './../src/presentation/openapi/openapi.js';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const databaseQuery = vi.fn().mockResolvedValue([{ '?column?': 1 }]);

  beforeAll(async () => {
    Object.assign(process.env, {
      NODE_ENV: 'test',
      PORT: '3001',
      DATABASE_URL: 'postgresql://user:password@localhost:5432/app',
      JWT_ACCESS_SECRET: 'a-secure-test-secret-with-32-characters',
      JWT_ACCESS_TTL: '15m',
      REFRESH_TOKEN_TTL: '7d',
      YOUTUBE_API_KEY: 'youtube-test-key',
      FRONTEND_ORIGIN: 'http://localhost:5173',
      LOG_LEVEL: 'error',
    });
    const { AppModule } = await import('./../src/app.module.js');
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DataSource)
      .useValue({
        isInitialized: false,
        query: databaseQuery,
        transaction: vi.fn(),
        destroy: vi.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    setupOpenApi(app);
    await app.init();
  });

  it('wraps successful responses and returns request context headers', () => {
    return request(app.getHttpServer())
      .get('/')
      .set('x-request-id', 'e2e-request-id')
      .expect(200)
      .expect('x-request-id', 'e2e-request-id')
      .expect({
        status: 'success',
        code: 200,
        message: 'Success',
        data: 'Hello World!',
      });
  });

  it('exposes liveness without external dependencies', () => {
    return request(app.getHttpServer())
      .get('/health/live')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          status: 'success',
          code: 200,
          data: { status: 'ok' },
        });
      });
  });

  it('checks the database for readiness', () => {
    return request(app.getHttpServer())
      .get('/health/ready')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          status: 'success',
          code: 200,
          data: {
            status: 'ready',
            checks: { application: 'up', database: 'up' },
          },
        });
      });
  });

  it('hides infrastructure details behind a generic public message', () => {
    databaseQuery.mockRejectedValueOnce(
      new Error('password authentication failed for database user'),
    );

    return request(app.getHttpServer())
      .get('/health/ready')
      .set('x-request-id', 'database-failure-id')
      .expect(503)
      .expect({
        code: 503,
        message: 'Service temporarily unavailable',
        error_code: 'DATABASE_NOT_READY',
        details: [],
        request_id: 'database-failure-id',
      });
  });

  it('serves a Swagger OpenAPI document with stable operation IDs', () => {
    return request(app.getHttpServer())
      .get('/docs/openapi.json')
      .expect(200)
      .expect(({ body }) => {
        expect(body.info.title).toBe('Pomodoro and Music API');
        expect(body.paths['/health/live'].get.operationId).toBe(
          'healthLiveness',
        );
        expect(body.components.securitySchemes['access-token']).toMatchObject({
          type: 'http',
          scheme: 'bearer',
        });
      });
  });

  it('normalizes HTTP exceptions', () => {
    return request(app.getHttpServer())
      .get('/not-found')
      .set('x-request-id', 'missing-route-id')
      .expect(404)
      .expect({
        code: 404,
        message: 'Cannot GET /not-found',
        error_code: 'RESOURCE_NOT_FOUND',
        details: [],
        request_id: 'missing-route-id',
      });
  });

  afterAll(async () => {
    await app?.close();
  });
});
