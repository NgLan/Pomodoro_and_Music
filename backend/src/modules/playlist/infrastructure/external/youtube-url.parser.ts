import {
  BusinessException,
  ErrorCode,
} from '../../../../common/exceptions/index.js';

const VIDEO_ID_PATTERN = /^[\w-]{6,20}$/;

export function parseYoutubeVideoId(value: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return invalidYoutubeUrl();
  }
  const hostname = url.hostname.replace(/^www\./, '').toLowerCase();
  const videoId =
    hostname === 'youtu.be'
      ? url.pathname.split('/').filter(Boolean)[0]
      : readYoutubeComId(hostname, url);
  if (!videoId || !VIDEO_ID_PATTERN.test(videoId)) return invalidYoutubeUrl();
  return videoId;
}

function readYoutubeComId(hostname: string, url: URL): string | null {
  if (
    !['youtube.com', 'm.youtube.com', 'music.youtube.com'].includes(hostname)
  ) {
    return null;
  }
  if (url.pathname === '/watch') return url.searchParams.get('v');
  const parts = url.pathname.split('/').filter(Boolean);
  return ['shorts', 'embed', 'live'].includes(parts[0] ?? '')
    ? (parts[1] ?? null)
    : null;
}

function invalidYoutubeUrl(): never {
  throw new BusinessException({
    code: ErrorCode.INVALID_YOUTUBE_URL,
    message: 'A valid YouTube video URL is required',
  });
}
