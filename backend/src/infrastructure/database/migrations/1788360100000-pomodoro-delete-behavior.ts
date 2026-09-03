import type { MigrationInterface, QueryRunner } from 'typeorm';

export class PomodoroDeleteBehavior1788360100000 implements MigrationInterface {
  name = 'PomodoroDeleteBehavior1788360100000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE pomodoro DROP CONSTRAINT fk_pomodoro_focus_playlist;
      ALTER TABLE pomodoro DROP CONSTRAINT fk_pomodoro_break_playlist;
      ALTER TABLE pomodoro_history DROP CONSTRAINT fk_pomodoro_history_pomodoro;

      ALTER TABLE pomodoro
        ADD CONSTRAINT fk_pomodoro_focus_playlist
        FOREIGN KEY (focus_playlist_id) REFERENCES playlists (id)
        ON DELETE SET NULL;
      ALTER TABLE pomodoro
        ADD CONSTRAINT fk_pomodoro_break_playlist
        FOREIGN KEY (break_playlist_id) REFERENCES playlists (id)
        ON DELETE SET NULL;
      ALTER TABLE pomodoro_history
        ADD CONSTRAINT fk_pomodoro_history_pomodoro
        FOREIGN KEY (pomodoro_id) REFERENCES pomodoro (id)
        ON DELETE SET NULL;
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE pomodoro DROP CONSTRAINT fk_pomodoro_focus_playlist;
      ALTER TABLE pomodoro DROP CONSTRAINT fk_pomodoro_break_playlist;
      ALTER TABLE pomodoro_history DROP CONSTRAINT fk_pomodoro_history_pomodoro;

      ALTER TABLE pomodoro
        ADD CONSTRAINT fk_pomodoro_focus_playlist
        FOREIGN KEY (focus_playlist_id) REFERENCES playlists (id);
      ALTER TABLE pomodoro
        ADD CONSTRAINT fk_pomodoro_break_playlist
        FOREIGN KEY (break_playlist_id) REFERENCES playlists (id);
      ALTER TABLE pomodoro_history
        ADD CONSTRAINT fk_pomodoro_history_pomodoro
        FOREIGN KEY (pomodoro_id) REFERENCES pomodoro (id);
    `);
  }
}
