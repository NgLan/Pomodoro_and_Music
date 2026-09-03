import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { PlaylistSourceType } from '../../../domain/enums/playlist-source-type.enum.js';

@Entity('playlists')
export class PlaylistOrmEntity {
  @PrimaryColumn('uuid') id!: string;
  @Index() @Column({ name: 'user_id', type: 'uuid' }) userId!: string;
  @Column({ type: 'varchar', length: 255 }) name!: string;
  @Column({ type: 'text', nullable: true }) description!: string | null;
  @Column({ name: 'thumbnail_url', type: 'text', nullable: true })
  thumbnailUrl!: string | null;
  @Column({ name: 'source_type', type: 'enum', enum: PlaylistSourceType })
  sourceType!: PlaylistSourceType;
  @Column({
    name: 'source_external_id',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  sourceExternalId!: string | null;
  @Column({ name: 'source_url', type: 'text', nullable: true }) sourceUrl!:
    string | null;
  @Column({ name: 'last_synced_at', type: 'timestamptz', nullable: true })
  lastSyncedAt!: Date | null;
  @Column({ name: 'created_at', type: 'timestamptz' }) createdAt!: Date;
  @Column({ name: 'updated_at', type: 'timestamptz' }) updatedAt!: Date;
}
