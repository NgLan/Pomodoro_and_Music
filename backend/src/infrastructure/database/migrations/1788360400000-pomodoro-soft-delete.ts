import type { MigrationInterface, QueryRunner } from 'typeorm';

export class PomodoroSoftDelete1788360400000 implements MigrationInterface {
  name = 'PomodoroSoftDelete1788360400000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE pomodoro ADD COLUMN deleted_at timestamptz NULL;
      CREATE INDEX idx_pomodoro_deleted_at ON pomodoro (deleted_at);
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_pomodoro_deleted_at;
      ALTER TABLE pomodoro DROP COLUMN IF EXISTS deleted_at;
    `);
  }
}
