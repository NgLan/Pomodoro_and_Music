import {
  BusinessException,
  ErrorCode,
} from '../../../../common/exceptions/index.js';

const YOUTUBE_HOSTS = [
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
];

export function parseYoutubePlaylistId(value: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return invalid();
  }
  const id = url.searchParams.get('list');
  if (
    !['https:', 'http:'].includes(url.protocol) ||
    !YOUTUBE_HOSTS.includes(url.hostname) ||
    !['/playlist', '/watch'].includes(url.pathname) ||
    url.username ||
    url.password ||
    !id ||
    !/^[\w-]{2,255}$/.test(id)
  )
    return invalid();
  return id;
}

function invalid(): never {
  throw new BusinessException({
    code: ErrorCode.INVALID_YOUTUBE_PLAYLIST_URL,
    message: 'A YouTube playlist URL is required',
  });
}
