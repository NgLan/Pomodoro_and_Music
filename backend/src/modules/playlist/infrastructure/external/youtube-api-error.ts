import {
  BusinessException,
  ErrorCode,
  InfrastructureException,
} from '../../../../common/exceptions/index.js';

const QUOTA_ERRORS = [
  'quotaExceeded',
  'dailyLimitExceeded',
  'rateLimitExceeded',
];

export function malformedYoutubeResponse(): never {
  throw new InfrastructureException({
    code: ErrorCode.YOUTUBE_RESPONSE_INVALID,
    message: 'Malformed YouTube response',
  });
}

export function translateYoutubeFailure(
  status: number,
  reason?: string,
): never {
  if (reason === 'playlistNotFound' || status === 404)
    throw new BusinessException({
      code: ErrorCode.YOUTUBE_PLAYLIST_NOT_FOUND,
      message: 'Source playlist not found',
    });
  if (reason === 'playlistForbidden' || reason === 'playlistItemsNotAccessible')
    throw new BusinessException({
      code: ErrorCode.YOUTUBE_PLAYLIST_PRIVATE,
      message: 'Source playlist is inaccessible',
    });
  const limited = status === 429 || QUOTA_ERRORS.includes(reason ?? '');
  throw new InfrastructureException({
    code: limited
      ? ErrorCode.YOUTUBE_RATE_LIMITED
      : ErrorCode.YOUTUBE_PROVIDER_UNAVAILABLE,
    message: `YouTube returned HTTP ${status}`,
  });
}

export function isYoutubeFailure(error: unknown) {
  return (
    error instanceof InfrastructureException ||
    error instanceof BusinessException
  );
}
