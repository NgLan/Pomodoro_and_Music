import { Column, Entity, Index, PrimaryColumn, Unique } from 'typeorm';

@Entity('playlist_items')
@Unique('uq_playlist_items_position', ['playlistId', 'position'])
export class PlaylistItemOrmEntity {
  @PrimaryColumn('uuid') id!: string;
  @Index() @Column({ name: 'playlist_id', type: 'uuid' }) playlistId!: string;
  @Column({ name: 'media_item_id', type: 'uuid' }) mediaItemId!: string;
  @Column({ type: 'integer' }) position!: number;
  @Column({ name: 'created_at', type: 'timestamptz' }) createdAt!: Date;
  @Column({ name: 'updated_at', type: 'timestamptz' }) updatedAt!: Date;
}
