import type { YoutubePlaylistOutput } from '../../application/outputs/youtube-playlist.output.js';
import { MediaAvailability } from '../../domain/enums/media-availability.enum.js';
import type { YoutubePlaylistItem } from './youtube-playlist.types.js';

export function mapPlaylistPreview(
  id: string,
  source: YoutubePlaylistItem,
  items: YoutubePlaylistOutput['items'],
  fetchedCount: number,
): YoutubePlaylistOutput {
  const availableCount = items.filter((item) => item.selectable).length;
  return {
    sourceExternalId: id,
    sourceUrl: `https://www.youtube.com/playlist?list=${id}`,
    title: source.snippet?.title || id,
    description: source.snippet?.description ?? null,
    thumbnailUrl: source.snippet?.thumbnails?.medium?.url ?? null,
    totalCount: source.contentDetails?.itemCount ?? fetchedCount,
    items,
    fetchedCount,
    availableCount,
    unavailableCount: items.length - availableCount,
    skippedCount: fetchedCount - items.length,
  };
}

export function unavailablePlaylistVideo(id: string) {
  return {
    externalMediaId: id,
    title: null,
    channelName: null,
    thumbnailUrl: null,
    durationSeconds: null,
    sourceUrl: `https://www.youtube.com/watch?v=${id}`,
    availability: MediaAvailability.UNAVAILABLE,
  };
}
