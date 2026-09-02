import type { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1788360000000 implements MigrationInterface {
  name = 'InitialSchema1788360000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE user_status AS ENUM ('ACTIVE', 'DISABLED');
      CREATE TYPE auth_provider AS ENUM ('LOCAL', 'GOOGLE');
      CREATE TYPE pomodoro_phase_type AS ENUM (
        'FOCUS',
        'SHORT_BREAK',
        'LONG_BREAK'
      );
      CREATE TYPE pomodoro_history_status AS ENUM (
        'COMPLETED',
        'ENDED_EARLY',
        'CANCELLED'
      );
      CREATE TYPE playlist_source_type AS ENUM ('MANUAL', 'YOUTUBE');
      CREATE TYPE media_platform AS ENUM ('YOUTUBE');
      CREATE TYPE media_availability AS ENUM (
        'AVAILABLE',
        'UNAVAILABLE',
        'PRIVATE',
        'DELETED',
        'REGION_BLOCKED',
        'UNKNOWN'
      );

      CREATE TABLE users (
        id uuid PRIMARY KEY,
        email varchar(320) NOT NULL,
        display_name varchar(120),
        password_hash varchar(255),
        auth_provider auth_provider NOT NULL DEFAULT 'LOCAL',
        provider_subject varchar(255),
        status user_status NOT NULL DEFAULT 'ACTIVE',
        created_at timestamptz NOT NULL,
        updated_at timestamptz NOT NULL,
        CONSTRAINT uq_users_email UNIQUE (email),
        CONSTRAINT uq_users_provider_subject
          UNIQUE (auth_provider, provider_subject)
      );
      CREATE INDEX idx_users_status ON users (status);

      CREATE TABLE refresh_tokens (
        id uuid PRIMARY KEY,
        user_id uuid NOT NULL,
        token_hash varchar(128) NOT NULL,
        expires_at timestamptz NOT NULL,
        revoked_at timestamptz,
        created_at timestamptz NOT NULL,
        CONSTRAINT uq_refresh_tokens_token_hash UNIQUE (token_hash),
        CONSTRAINT fk_refresh_tokens_user
          FOREIGN KEY (user_id) REFERENCES users (id)
      );
      CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens (user_id);
      CREATE INDEX idx_refresh_tokens_expires_at
        ON refresh_tokens (expires_at);

      CREATE TABLE playlists (
        id uuid PRIMARY KEY,
        user_id uuid NOT NULL,
        name varchar(255) NOT NULL,
        description text,
        thumbnail_url text,
        source_type playlist_source_type NOT NULL DEFAULT 'MANUAL',
        source_external_id varchar(255),
        source_url text,
        last_synced_at timestamptz,
        created_at timestamptz NOT NULL,
        updated_at timestamptz NOT NULL,
        CONSTRAINT fk_playlists_user
          FOREIGN KEY (user_id) REFERENCES users (id)
      );
      CREATE INDEX idx_playlists_user_id ON playlists (user_id);
      CREATE INDEX idx_playlists_user_name ON playlists (user_id, name);
      CREATE INDEX idx_playlists_source
        ON playlists (source_type, source_external_id);

      CREATE TABLE media_items (
        id uuid PRIMARY KEY,
        platform media_platform NOT NULL,
        external_media_id varchar(128) NOT NULL,
        title varchar(500),
        channel_name varchar(255),
        duration_seconds integer,
        thumbnail_url text,
        source_url text NOT NULL,
        availability media_availability NOT NULL DEFAULT 'UNKNOWN',
        metadata jsonb,
        created_at timestamptz NOT NULL,
        updated_at timestamptz NOT NULL,
        CONSTRAINT uq_media_items_platform_external_id
          UNIQUE (platform, external_media_id),
        CONSTRAINT ck_media_items_duration
          CHECK (duration_seconds IS NULL OR duration_seconds >= 0)
      );
      CREATE INDEX idx_media_items_availability
        ON media_items (availability);

      CREATE TABLE playlist_items (
        id uuid PRIMARY KEY,
        playlist_id uuid NOT NULL,
        media_item_id uuid NOT NULL,
        position integer NOT NULL,
        created_at timestamptz NOT NULL,
        updated_at timestamptz NOT NULL,
        CONSTRAINT fk_playlist_items_playlist
          FOREIGN KEY (playlist_id) REFERENCES playlists (id),
        CONSTRAINT fk_playlist_items_media_item
          FOREIGN KEY (media_item_id) REFERENCES media_items (id),
        CONSTRAINT uq_playlist_items_position
          UNIQUE (playlist_id, position),
        CONSTRAINT ck_playlist_items_position CHECK (position >= 0)
      );
      CREATE INDEX idx_playlist_items_media
        ON playlist_items (playlist_id, media_item_id);
      CREATE INDEX idx_playlist_items_playlist_id
        ON playlist_items (playlist_id);

      CREATE TABLE pomodoro (
        id uuid PRIMARY KEY,
        user_id uuid NOT NULL,
        name varchar(120) NOT NULL,
        focus_duration_seconds integer NOT NULL,
        short_break_duration_seconds integer NOT NULL,
        long_break_duration_seconds integer NOT NULL,
        focus_sessions_before_long_break integer NOT NULL,
        focus_playlist_id uuid,
        break_playlist_id uuid,
        is_default boolean NOT NULL DEFAULT false,
        created_at timestamptz NOT NULL,
        updated_at timestamptz NOT NULL,
        CONSTRAINT fk_pomodoro_user
          FOREIGN KEY (user_id) REFERENCES users (id),
        CONSTRAINT fk_pomodoro_focus_playlist
          FOREIGN KEY (focus_playlist_id) REFERENCES playlists (id),
        CONSTRAINT fk_pomodoro_break_playlist
          FOREIGN KEY (break_playlist_id) REFERENCES playlists (id),
        CONSTRAINT ck_pomodoro_focus_duration
          CHECK (focus_duration_seconds > 0),
        CONSTRAINT ck_pomodoro_short_break_duration
          CHECK (short_break_duration_seconds > 0),
        CONSTRAINT ck_pomodoro_long_break_duration
          CHECK (long_break_duration_seconds > 0),
        CONSTRAINT ck_pomodoro_focus_sessions
          CHECK (focus_sessions_before_long_break >= 1)
      );
      CREATE INDEX idx_pomodoro_user_id ON pomodoro (user_id);
      CREATE INDEX idx_pomodoro_user_name ON pomodoro (user_id, name);

      CREATE TABLE user_settings (
        user_id uuid PRIMARY KEY,
        locale varchar(16) NOT NULL DEFAULT 'vi',
        timezone varchar(64) NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
        default_pomodoro_id uuid,
        browser_notification_enabled boolean NOT NULL DEFAULT false,
        sound_notification_enabled boolean NOT NULL DEFAULT true,
        created_at timestamptz NOT NULL,
        updated_at timestamptz NOT NULL,
        CONSTRAINT fk_user_settings_user
          FOREIGN KEY (user_id) REFERENCES users (id),
        CONSTRAINT fk_user_settings_default_pomodoro
          FOREIGN KEY (default_pomodoro_id) REFERENCES pomodoro (id)
      );

      CREATE TABLE pomodoro_history (
        id uuid PRIMARY KEY,
        user_id uuid NOT NULL,
        pomodoro_id uuid,
        phase_type pomodoro_phase_type NOT NULL,
        planned_duration_seconds integer NOT NULL,
        actual_duration_seconds integer NOT NULL,
        status pomodoro_history_status NOT NULL,
        started_at timestamptz NOT NULL,
        ended_at timestamptz NOT NULL,
        CONSTRAINT fk_pomodoro_history_user
          FOREIGN KEY (user_id) REFERENCES users (id),
        CONSTRAINT fk_pomodoro_history_pomodoro
          FOREIGN KEY (pomodoro_id) REFERENCES pomodoro (id),
        CONSTRAINT ck_pomodoro_history_planned_duration
          CHECK (planned_duration_seconds > 0),
        CONSTRAINT ck_pomodoro_history_actual_duration
          CHECK (actual_duration_seconds >= 0),
        CONSTRAINT ck_pomodoro_history_time_range
          CHECK (ended_at >= started_at)
      );
      CREATE INDEX idx_pomodoro_history_user_id
        ON pomodoro_history (user_id);
      CREATE INDEX idx_pomodoro_history_user_started_at
        ON pomodoro_history (user_id, started_at);
      CREATE INDEX idx_pomodoro_history_pomodoro_id
        ON pomodoro_history (pomodoro_id);
      CREATE INDEX idx_pomodoro_history_phase_type
        ON pomodoro_history (phase_type);
      CREATE INDEX idx_pomodoro_history_status
        ON pomodoro_history (status);
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE pomodoro_history;
      DROP TABLE user_settings;
      DROP TABLE pomodoro;
      DROP TABLE playlist_items;
      DROP TABLE media_items;
      DROP TABLE playlists;
      DROP TABLE refresh_tokens;
      DROP TABLE users;

      DROP TYPE media_availability;
      DROP TYPE media_platform;
      DROP TYPE playlist_source_type;
      DROP TYPE pomodoro_history_status;
      DROP TYPE pomodoro_phase_type;
      DROP TYPE auth_provider;
      DROP TYPE user_status;
    `);
  }
}
