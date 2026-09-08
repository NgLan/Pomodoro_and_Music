import { PlaylistItemRemovalService } from '../../../src/modules/playlist/application/services/playlist-item-removal.service.js';
import { createPlaylistItem } from '../../../src/modules/playlist/application/services/playlist.factory.js';
import { importFixture, video } from './youtube-playlist.fixture.js';

it('remembers a manually added video when removed from an imported playlist', async () => {
  const f = importFixture();
  const item = createPlaylistItem(f.playlist.id, 'media-id', 0);
  f.items.findDetailed.mockResolvedValue([{ item, media: video('manual1') }]);
  const removal = new PlaylistItemRemovalService(
    f.playlists,
    f.items,
    f.history,
    f.transaction,
  );
  await removal.remove('owner', f.playlist.id, item.id);
  expect(f.history.remember).toHaveBeenCalledWith(f.playlist.id, ['manual1']);
  expect(f.items.remove).toHaveBeenCalledWith(item.id);
});

it('does not record deletion or remove anything for a different owner', async () => {
  const f = importFixture();
  f.playlists.findByIdForUser.mockResolvedValue(null);
  const removal = new PlaylistItemRemovalService(
    f.playlists,
    f.items,
    f.history,
    f.transaction,
  );
  await expect(
    removal.remove('stranger', f.playlist.id, 'item'),
  ).rejects.toThrow();
  expect(f.history.remember).not.toHaveBeenCalled();
  expect(f.items.remove).not.toHaveBeenCalled();
});
