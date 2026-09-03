import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';
import { MediaAvailability } from '../../../domain/enums/media-availability.enum.js';
import { MediaPlatform } from '../../../domain/enums/media-platform.enum.js';

@Entity('media_items')
@Unique('uq_media_items_platform_external_id', ['platform', 'externalMediaId'])
export class MediaItemOrmEntity {
  @PrimaryColumn('uuid') id!: string;
  @Column({ type: 'enum', enum: MediaPlatform }) platform!: MediaPlatform;
  @Column({ name: 'external_media_id', type: 'varchar', length: 128 })
  externalMediaId!: string;
  @Column({ type: 'varchar', length: 500, nullable: true }) title!:
    string | null;
  @Column({
    name: 'channel_name',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  channelName!: string | null;
  @Column({ name: 'thumbnail_url', type: 'text', nullable: true })
  thumbnailUrl!: string | null;
  @Column({ name: 'duration_seconds', type: 'integer', nullable: true })
  durationSeconds!: number | null;
  @Column({ name: 'source_url', type: 'text' }) sourceUrl!: string;
  @Column({ type: 'enum', enum: MediaAvailability })
  availability!: MediaAvailability;
  @Column({ type: 'jsonb', nullable: true }) metadata!: Record<
    string,
    unknown
  > | null;
  @Column({ name: 'created_at', type: 'timestamptz' }) createdAt!: Date;
  @Column({ name: 'updated_at', type: 'timestamptz' }) updatedAt!: Date;
}
