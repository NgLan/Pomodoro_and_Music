import 'reflect-metadata';
import { writeFile } from 'node:fs/promises';
import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';

// Generate the real application contract without connecting to a database.
Object.assign(process.env, {
  NODE_ENV: 'test',
  PORT: '3001',
  DATABASE_URL: 'postgresql://user:password@localhost:5432/app',
  JWT_ACCESS_SECRET: 'openapi-generation-only-secret-32-characters',
  JWT_ACCESS_TTL: '15m',
  REFRESH_TOKEN_TTL: '30d',
  YOUTUBE_API_KEY: 'openapi-generation-placeholder',
  FRONTEND_ORIGIN: 'http://localhost:5173',
  LOG_LEVEL: 'error',
});
const { AppModule } = await import('../dist/app.module.js');
const { createOpenApiDocument } =
  await import('../dist/presentation/openapi/openapi.js');
const module = await Test.createTestingModule({ imports: [AppModule] })
  .overrideProvider(DataSource)
  .useValue({
    entityMetadatas: [],
    options: { type: 'postgres' },
    getRepository: () => ({}),
    isInitialized: false,
    destroy: async () => {},
  })
  .compile();
const app = module.createNestApplication();
try {
  const document = createOpenApiDocument(app);
  await writeFile(
    new URL('../../frontend/openapi/openapi.json', import.meta.url),
    `${JSON.stringify(document, null, 2)}\n`,
  );
} finally {
  await app.close();
}
