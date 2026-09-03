import { MediaAvailability } from '../../domain/enums/media-availability.enum.js';

export interface MediaMetadataOutput {
  externalMediaId: string;
  title: string | null;
  channelName: string | null;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
  sourceUrl: string;
  availability: MediaAvailability;
}
