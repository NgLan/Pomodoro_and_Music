import { YoutubeApiClient } from '../../../src/modules/playlist/infrastructure/external/youtube-api.client.js';
import { YoutubePlaylistProvider } from '../../../src/modules/playlist/infrastructure/external/youtube-playlist.provider.js';
import { parseYoutubePlaylistId } from '../../../src/modules/playlist/infrastructure/external/youtube-playlist-url.parser.js';

const url = 'https://www.youtube.com/playlist?list=PLtest';
const response = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status });
const entry = (videoId: string) => ({ snippet: { resourceId: { videoId } } });
const metadata = (id: string) => ({
  id,
  snippet: { title: id },
  status: { privacyStatus: 'public', embeddable: true },
});

afterEach(() => vi.unstubAllGlobals());

it.each([url, 'https://music.youtube.com/watch?v=123456&list=PLtest'])(
  'parses %s',
  (value) => {
    expect(parseYoutubePlaylistId(value)).toBe('PLtest');
  },
);
it.each([
  'https://youtube.com/watch?v=123456',
  'https://evil.com/playlist?list=PLtest',
  'ftp://youtube.com/playlist?list=PLtest',
  'nonsense',
])('rejects %s', (value) => {
  expect(() => parseYoutubePlaylistId(value)).toThrow();
});

it('reads multiple pages, deduplicates and retains unavailable identities', async () => {
  const fetch = paginatedFetch();
  vi.stubGlobal('fetch', fetch);
  const provider = new YoutubePlaylistProvider(
    new YoutubeApiClient({ apiKey: 'test' }),
  );
  const preview = await provider.preview(url);
  expect(preview).toMatchObject({
    fetchedCount: 4,
    availableCount: 2,
    unavailableCount: 1,
    skippedCount: 1,
  });
  expect(preview.items.map((item) => item.externalMediaId)).toEqual([
    'video01',
    'video02',
    'video03',
  ]);
  expect(preview.items[1]!.selectable).toBe(false);
  expect(fetch.mock.calls[2]![0].searchParams.get('pageToken')).toBe('next');
});

it.each([
  [403, 'playlistForbidden', 'YOUTUBE_PLAYLIST_PRIVATE'],
  [404, 'playlistNotFound', 'YOUTUBE_PLAYLIST_NOT_FOUND'],
  [403, 'quotaExceeded', 'YOUTUBE_RATE_LIMITED'],
])('translates %s %s', async (status, reason, code) => {
  vi.stubGlobal(
    'fetch',
    vi
      .fn()
      .mockResolvedValue(response({ error: { errors: [{ reason }] } }, status)),
  );
  const provider = new YoutubePlaylistProvider(
    new YoutubeApiClient({ apiKey: 'test' }),
  );
  await expect(provider.preview(url)).rejects.toMatchObject({ code });
});

it('rejects malformed data', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(response({ unexpected: true })),
  );
  await expect(
    new YoutubeApiClient({ apiKey: 'test' }).request('playlists', {}),
  ).rejects.toMatchObject({ code: 'YOUTUBE_RESPONSE_INVALID' });
});

it('retries network failure only once', async () => {
  const fetch = vi.fn().mockRejectedValue(new TypeError('offline'));
  vi.stubGlobal('fetch', fetch);
  await expect(
    new YoutubeApiClient({ apiKey: 'test' }).request('playlists', {}),
  ).rejects.toMatchObject({ code: 'YOUTUBE_PROVIDER_UNAVAILABLE' });
  expect(fetch).toHaveBeenCalledTimes(2);
});

function paginatedFetch() {
  const fetch = vi
    .fn()
    .mockResolvedValueOnce(
      response({
        items: [
          { snippet: { title: 'Focus' }, contentDetails: { itemCount: 4 } },
        ],
      }),
    )
    .mockResolvedValueOnce(
      response({
        items: [entry('video01'), entry('video02')],
        nextPageToken: 'next',
      }),
    )
    .mockResolvedValueOnce(
      response({ items: [entry('video03'), entry('video01')] }),
    )
    .mockResolvedValueOnce(
      response({ items: [metadata('video01'), metadata('video03')] }),
    );
  return fetch;
}
