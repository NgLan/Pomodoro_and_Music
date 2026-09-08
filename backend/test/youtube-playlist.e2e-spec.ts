import type { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { CommonModule } from '../src/common/common.module.js';
import { appConfig } from '../src/common/config/index.js';
import { AuthenticationService } from '../src/modules/authentication/application/services/authentication.service.js';
import { YoutubePlaylistController } from '../src/modules/playlist/presentation/controllers/youtube-playlist.controller.js';
import { YoutubePlaylistImportService } from '../src/modules/playlist/application/services/youtube-playlist-import.service.js';
import { YoutubePlaylistSyncService } from '../src/modules/playlist/application/services/youtube-playlist-sync.service.js';
import { createOpenApiDocument } from '../src/presentation/openapi/openapi.js';
import { source } from './unit/playlist/youtube-playlist.fixture.js';

let app: INestApplication;
const importer = {
  preview: vi.fn().mockResolvedValue(source()),
  import: vi.fn().mockResolvedValue({
    playlistId: 'created',
    importedCount: 1,
    skippedCount: 0,
    unavailableCount: 1,
  }),
};
const sync = {
  sync: vi.fn().mockResolvedValue({
    addedCount: 0,
    skippedCount: 0,
    unavailableCount: 0,
    syncedAt: '2026-09-08T00:00:00Z',
  }),
};
const authorization = { Authorization: 'Bearer test-token' };

beforeAll(async () => {
  const module = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
      CommonModule,
    ],
    controllers: [YoutubePlaylistController],
    providers: [
      {
        provide: AuthenticationService,
        useValue: { authenticate: vi.fn().mockResolvedValue({ id: 'owner' }) },
      },
      { provide: YoutubePlaylistImportService, useValue: importer },
      { provide: YoutubePlaylistSyncService, useValue: sync },
    ],
  }).compile();
  app = module.createNestApplication();
  await app.init();
});
afterAll(async () => {
  await app.close();
});
beforeEach(() => vi.clearAllMocks());

it.each([
  '/youtube/playlists/preview',
  '/youtube/playlists/import',
  '/playlists/00000000-0000-4000-8000-000000000001/sync',
])('requires authentication for %s', async (path) => {
  await request(app.getHttpServer()).post(path).send({}).expect(401);
  expect(importer.preview).not.toHaveBeenCalled();
});

it('returns preview in the standard envelope', async () => {
  const result = await request(app.getHttpServer())
    .post('/youtube/playlists/preview')
    .set(authorization)
    .send({ url: source().sourceUrl })
    .expect(201);
  expect(result.body).toMatchObject({
    status: 'success',
    data: { sourceExternalId: 'PLtest', availableCount: 2 },
  });
});

it('rejects empty selections and extra client metadata before the use case', async () => {
  await request(app.getHttpServer())
    .post('/youtube/playlists/import')
    .set(authorization)
    .send({ url: source().sourceUrl, selectedVideoIds: [], title: 'Invented' })
    .expect(400);
  expect(importer.import).not.toHaveBeenCalled();
});

it('passes authenticated ownership and only validated import fields', async () => {
  const body = {
    url: source().sourceUrl,
    selectedVideoIds: ['video01'],
    name: 'Personal copy',
  };
  await request(app.getHttpServer())
    .post('/youtube/playlists/import')
    .set(authorization)
    .send(body)
    .expect(201);
  expect(importer.import).toHaveBeenCalledWith('owner', body);
});

it('publishes preview, selection and sync response schemas', () => {
  const contract = createOpenApiDocument(app);
  expect(contract.paths['/youtube/playlists/preview']?.post?.operationId).toBe(
    'youtubePlaylistPreview',
  );
  expect(contract.paths['/youtube/playlists/import']?.post?.operationId).toBe(
    'youtubePlaylistImport',
  );
  expect(contract.paths['/playlists/{id}/sync']?.post?.operationId).toBe(
    'youtubePlaylistSync',
  );
  expect(
    contract.components?.schemas?.YoutubePlaylistImportRequestDto,
  ).toMatchObject({ required: ['url', 'selectedVideoIds'] });
});
