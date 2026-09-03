import type { MigrationInterface, QueryRunner } from 'typeorm';

export class PlaylistDeleteBehavior1788360200000 implements MigrationInterface {
  name = 'PlaylistDeleteBehavior1788360200000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE playlist_items DROP CONSTRAINT fk_playlist_items_playlist;
      ALTER TABLE playlist_items
        ADD CONSTRAINT fk_playlist_items_playlist
        FOREIGN KEY (playlist_id) REFERENCES playlists (id)
        ON DELETE CASCADE;
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE playlist_items DROP CONSTRAINT fk_playlist_items_playlist;
      ALTER TABLE playlist_items
        ADD CONSTRAINT fk_playlist_items_playlist
        FOREIGN KEY (playlist_id) REFERENCES playlists (id);
    `);
  }
}
