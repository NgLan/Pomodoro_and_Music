import { Entity, PrimaryColumn } from 'typeorm';

@Entity('playlist_source_history')
export class PlaylistSourceHistoryOrmEntity {
  @PrimaryColumn({ name: 'playlist_id', type: 'uuid' }) playlistId!: string;
  @PrimaryColumn({ name: 'video_id', type: 'varchar', length: 255 })
  videoId!: string;
}
