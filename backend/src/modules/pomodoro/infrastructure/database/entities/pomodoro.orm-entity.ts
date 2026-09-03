import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('pomodoro')
export class PomodoroOrmEntity {
  @PrimaryColumn('uuid') id!: string;
  @Index() @Column({ name: 'user_id', type: 'uuid' }) userId!: string;
  @Column({ type: 'varchar', length: 120 }) name!: string;
  @Column({ name: 'focus_duration_seconds', type: 'integer' }) focusDurationSeconds!: number;
  @Column({ name: 'short_break_duration_seconds', type: 'integer' }) shortBreakDurationSeconds!: number;
  @Column({ name: 'long_break_duration_seconds', type: 'integer' }) longBreakDurationSeconds!: number;
  @Column({ name: 'focus_sessions_before_long_break', type: 'integer' }) focusSessionsBeforeLongBreak!: number;
  @Column({ name: 'focus_playlist_id', type: 'uuid', nullable: true }) focusPlaylistId!: string | null;
  @Column({ name: 'break_playlist_id', type: 'uuid', nullable: true }) breakPlaylistId!: string | null;
  @Column({ name: 'is_default', type: 'boolean', default: false }) isDefault!: boolean;
  @Column({ name: 'created_at', type: 'timestamptz' }) createdAt!: Date;
  @Column({ name: 'updated_at', type: 'timestamptz' }) updatedAt!: Date;
}
