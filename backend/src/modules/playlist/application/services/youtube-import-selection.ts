import {
  BusinessException,
  ErrorCode,
} from '../../../../common/exceptions/index.js';
import type { YoutubePlaylistOutput } from '../outputs/youtube-playlist.output.js';

export function selectImportedVideos(
  source: YoutubePlaylistOutput,
  ids: string[],
) {
  const selected = new Set(ids);
  const matches = source.items.filter((item) =>
    selected.has(item.externalMediaId),
  );
  if (!selected.size || matches.length !== selected.size)
    throw new BusinessException({
      code: ErrorCode.INVALID_INPUT,
      message: 'Select videos belonging to the source playlist',
    });
  const videos = matches.filter((item) => item.selectable);
  if (!videos.length)
    throw new BusinessException({
      code: ErrorCode.MEDIA_UNAVAILABLE,
      message: 'Selected videos are unavailable',
    });
  return videos;
}
