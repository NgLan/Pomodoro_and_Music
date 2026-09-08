import { importFixture, video } from './youtube-playlist.fixture.js';

it('keeps reordered/manual tracks and never restores excluded or removed videos', async () => {
  const f = importFixture();
  f.history.read.mockResolvedValue(['video01']);
  f.items.findDetailed.mockResolvedValue([{ media: video('manual1') }]);
  const result = await f.sync.sync('owner', f.playlist.id);
  expect(result).toMatchObject({ addedCount: 1, unavailableCount: 1 });
  expect(f.media.save.mock.calls.map(([item]) => item.externalMediaId)).toEqual(
    ['video02'],
  );
  expect(f.items.append.mock.calls[0]![0].position).toBe(1);
  expect(f.items.reorder).not.toHaveBeenCalled();
  expect(f.items.remove).not.toHaveBeenCalled();
  expect(f.playlists.save.mock.calls[0]![0]).toMatchObject({
    name: 'My renamed playlist',
  });
});

it('reports no new videos and updates sync time', async () => {
  const f = importFixture();
  f.history.read.mockResolvedValue(['video01', 'video02']);
  const result = await f.sync.sync('owner', f.playlist.id);
  expect(result.addedCount).toBe(0);
  expect(f.items.append).not.toHaveBeenCalled();
  expect(f.playlists.save.mock.calls[0]![0].lastSyncedAt.toISOString()).toBe(
    result.syncedAt,
  );
});

it('checks ownership before contacting YouTube', async () => {
  const f = importFixture();
  f.playlists.findByIdForUser.mockResolvedValue(null);
  await expect(f.sync.sync('stranger', f.playlist.id)).rejects.toThrow();
  expect(f.provider.preview).not.toHaveBeenCalled();
});

it('leaves local data and sync time untouched when the provider fails', async () => {
  const f = importFixture();
  f.provider.preview.mockRejectedValue(new Error('quota'));
  await expect(f.sync.sync('owner', f.playlist.id)).rejects.toThrow('quota');
  expect(f.playlists.save).not.toHaveBeenCalled();
  expect(f.items.append).not.toHaveBeenCalled();
  expect(f.history.remember).not.toHaveBeenCalled();
});
