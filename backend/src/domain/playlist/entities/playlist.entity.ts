import { PlaylistSourceType } from '../enums/playlist-source-type.enum.js';

export interface PlaylistProps {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  thumbnailUrl: string | null;
  sourceType: PlaylistSourceType;
  sourceExternalId: string | null;
  sourceUrl: string | null;
  lastSyncedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Playlist {
  readonly id: string;
  readonly userId: string;
  readonly name: string;
  readonly description: string | null;
  readonly thumbnailUrl: string | null;
  readonly sourceType: PlaylistSourceType;
  readonly sourceExternalId: string | null;
  readonly sourceUrl: string | null;
  private readonly lastSyncedAtValue: Date | null;
  private readonly createdAtValue: Date;
  private readonly updatedAtValue: Date;

  private constructor(props: PlaylistProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.name = props.name;
    this.description = props.description;
    this.thumbnailUrl = props.thumbnailUrl;
    this.sourceType = props.sourceType;
    this.sourceExternalId = props.sourceExternalId;
    this.sourceUrl = props.sourceUrl;
    this.lastSyncedAtValue = props.lastSyncedAt
      ? new Date(props.lastSyncedAt)
      : null;
    this.createdAtValue = new Date(props.createdAt);
    this.updatedAtValue = new Date(props.updatedAt);
  }

  static create(props: PlaylistProps): Playlist {
    return new Playlist(props);
  }

  get lastSyncedAt(): Date | null {
    return this.lastSyncedAtValue ? new Date(this.lastSyncedAtValue) : null;
  }

  get createdAt(): Date {
    return new Date(this.createdAtValue);
  }

  get updatedAt(): Date {
    return new Date(this.updatedAtValue);
  }
}
