import type { MigrationInterface, QueryRunner } from 'typeorm';

export class PlaylistSourceHistory1788360300000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE playlist_source_history (
      playlist_id uuid NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
      video_id varchar(255) NOT NULL,
      PRIMARY KEY (playlist_id, video_id)
    )`);
    await queryRunner.query(`INSERT INTO playlist_source_history (playlist_id, video_id)
      SELECT DISTINCT p.id, m.external_media_id FROM playlists p
      JOIN playlist_items i ON i.playlist_id = p.id
      JOIN media_items m ON m.id = i.media_item_id WHERE p.source_type = 'YOUTUBE'`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE playlist_source_history');
  }
}
