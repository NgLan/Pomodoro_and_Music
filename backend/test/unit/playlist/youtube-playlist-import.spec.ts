import { importFixture, source } from './youtube-playlist.fixture.js';

it('previews without writing or opening a transaction', async () => {
  const f = importFixture();
  expect(await f.importer.preview(source().sourceUrl)).toEqual(source());
  expect(f.playlists.save).not.toHaveBeenCalled();
  expect(f.transaction.execute).not.toHaveBeenCalled();
});

it('imports only selected videos in source order and remembers exclusions', async () => {
  const f = importFixture();
  const result = await f.importer.import('owner', {
    url: source().sourceUrl,
    selectedVideoIds: ['video02', 'video01'],
  });
  expect(result.importedCount).toBe(2);
  expect(f.media.save.mock.calls.map(([item]) => item.externalMediaId)).toEqual(
    ['video01', 'video02'],
  );
  expect(f.items.append.mock.calls.map(([item]) => item.position)).toEqual([
    0, 1,
  ]);
  expect(f.history.remember).toHaveBeenCalledWith(result.playlistId, [
    'video01',
    'video02',
    'video03',
  ]);
  expect(f.playlists.save.mock.calls[0]![0]).toMatchObject({
    userId: 'owner',
    sourceType: 'YOUTUBE',
    sourceExternalId: 'PLtest',
  });
});

it('imports a partial selection and creates independent copies', async () => {
  const f = importFixture();
  const input = { url: source().sourceUrl, selectedVideoIds: ['video02'] };
  const first = await f.importer.import('owner', input);
  const second = await f.importer.import('owner', input);
  expect(first.importedCount).toBe(1);
  expect(first.playlistId).not.toBe(second.playlistId);
  expect(
    f.media.save.mock.calls.every(
      ([item]) => item.externalMediaId === 'video02',
    ),
  ).toBe(true);
});

it.each([
  { selectedVideoIds: [] },
  { selectedVideoIds: ['invented'] },
  { selectedVideoIds: ['video03'] },
])(
  'rejects an invalid selection %j without writes',
  async ({ selectedVideoIds }) => {
    const f = importFixture();
    await expect(
      f.importer.import('owner', {
        url: source().sourceUrl,
        selectedVideoIds,
      }),
    ).rejects.toThrow();
    expect(f.transaction.execute).not.toHaveBeenCalled();
  },
);

it('propagates a mid-write error out of the transaction and never reports success', async () => {
  const f = importFixture();
  f.items.append.mockRejectedValueOnce(new Error('database write failed'));
  await expect(
    f.importer.import('owner', {
      url: source().sourceUrl,
      selectedVideoIds: ['video01'],
    }),
  ).rejects.toThrow('database write failed');
  expect(f.transaction.execute).toHaveBeenCalledOnce();
  expect(f.history.remember).not.toHaveBeenCalled();
});
