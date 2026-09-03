import {
  BusinessException,
  ErrorCode,
} from '../../../../common/exceptions/index.js';
import { MediaAvailability } from '../enums/media-availability.enum.js';
import { MediaPlatform } from '../enums/media-platform.enum.js';

export interface MediaItemProps {
  id: string;
  platform: MediaPlatform;
  externalMediaId: string;
  title: string | null;
  channelName: string | null;
  thumbnailUrl: string | null;
  durationSeconds?: number | null;
  sourceUrl: string;
  availability: MediaAvailability;
  metadata?: Readonly<Record<string, unknown>> | null;
  createdAt: Date;
  updatedAt: Date;
}

export class MediaItem {
  readonly id: string;
  readonly platform: MediaPlatform;
  readonly externalMediaId: string;
  readonly title: string | null;
  readonly channelName: string | null;
  readonly thumbnailUrl: string | null;
  readonly durationSeconds: number | null;
  readonly sourceUrl: string;
  readonly availability: MediaAvailability;
  readonly metadata: Readonly<Record<string, unknown>> | null;
  private readonly createdAtValue: Date;
  private readonly updatedAtValue: Date;

  private constructor(props: MediaItemProps) {
    const durationSeconds = props.durationSeconds ?? null;
    if (
      durationSeconds !== null &&
      (!Number.isFinite(durationSeconds) || durationSeconds < 0)
    ) {
      throw new BusinessException({
        code: ErrorCode.INVALID_MEDIA_DURATION,
        message: 'Media duration cannot be negative',
      });
    }

    this.id = props.id;
    this.platform = props.platform;
    this.externalMediaId = props.externalMediaId;
    this.title = props.title;
    this.channelName = props.channelName;
    this.thumbnailUrl = props.thumbnailUrl;
    this.durationSeconds = durationSeconds;
    this.sourceUrl = props.sourceUrl;
    this.availability = props.availability;
    this.metadata = props.metadata ? { ...props.metadata } : null;
    this.createdAtValue = new Date(props.createdAt);
    this.updatedAtValue = new Date(props.updatedAt);
  }

  static create(props: MediaItemProps): MediaItem {
    return new MediaItem(props);
  }

  get createdAt(): Date {
    return new Date(this.createdAtValue);
  }

  get updatedAt(): Date {
    return new Date(this.updatedAtValue);
  }
}
