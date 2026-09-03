import type { MediaMetadataOutput } from '../../application/outputs/media-metadata.output.js';
import { MediaAvailability } from '../../domain/enums/media-availability.enum.js';
import type { YoutubeVideoItem } from './youtube-api.types.js';
import { parseYoutubeDuration } from './youtube-duration.parser.js';

export function mapYoutubeVideo(item: YoutubeVideoItem): MediaMetadataOutput {
  const id = item.id ?? '';
  const thumbnail = item.snippet?.thumbnails;
  return {
    externalMediaId: id,
    title: item.snippet?.title ?? null,
    channelName: item.snippet?.channelTitle ?? null,
    thumbnailUrl: thumbnail?.medium?.url ?? thumbnail?.default?.url ?? null,
    durationSeconds: parseYoutubeDuration(item.contentDetails?.duration),
    sourceUrl: `https://www.youtube.com/watch?v=${id}`,
    availability:
      item.status?.privacyStatus === 'public'
        ? MediaAvailability.AVAILABLE
        : MediaAvailability.UNAVAILABLE,
  };
}
