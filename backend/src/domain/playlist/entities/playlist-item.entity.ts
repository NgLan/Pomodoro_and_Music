import {
  BusinessException,
  ErrorCode,
} from '../../../common/exceptions/index.js';

export interface PlaylistItemProps {
  id: string;
  playlistId: string;
  mediaItemId: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

export class PlaylistItem {
  readonly id: string;
  readonly playlistId: string;
  readonly mediaItemId: string;
  readonly position: number;
  private readonly createdAtValue: Date;
  private readonly updatedAtValue: Date;

  private constructor(props: PlaylistItemProps) {
    PlaylistItem.assertValidPosition(props.position);
    this.id = props.id;
    this.playlistId = props.playlistId;
    this.mediaItemId = props.mediaItemId;
    this.position = props.position;
    this.createdAtValue = new Date(props.createdAt);
    this.updatedAtValue = new Date(props.updatedAt);
  }

  static create(props: PlaylistItemProps): PlaylistItem {
    return new PlaylistItem(props);
  }

  get createdAt(): Date {
    return new Date(this.createdAtValue);
  }

  get updatedAt(): Date {
    return new Date(this.updatedAtValue);
  }

  withPosition(position: number): PlaylistItem {
    return PlaylistItem.create({
      id: this.id,
      playlistId: this.playlistId,
      mediaItemId: this.mediaItemId,
      position,
      createdAt: this.createdAtValue,
      updatedAt: this.updatedAtValue,
    });
  }

  private static assertValidPosition(position: number): void {
    if (!Number.isInteger(position) || position < 0) {
      throw new BusinessException({
        code: ErrorCode.INVALID_PLAYLIST_POSITION,
        message: 'Playlist item position must be a non-negative integer',
      });
    }
  }
}
