import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { PomodoroHistoryStatus } from '../../../domain/enums/pomodoro-history-status.enum.js';
import { PomodoroPhaseType } from '../../../domain/enums/pomodoro-phase-type.enum.js';

@Entity('pomodoro_history')
export class PomodoroHistoryOrmEntity {
  @PrimaryColumn('uuid') id!: string;
  @Index() @Column({ name: 'user_id', type: 'uuid' }) userId!: string;
  @Index()
  @Column({ name: 'pomodoro_id', type: 'uuid', nullable: true })
  pomodoroId!: string | null;
  @Column({ name: 'phase_type', type: 'enum', enum: PomodoroPhaseType })
  phaseType!: PomodoroPhaseType;
  @Column({ name: 'planned_duration_seconds', type: 'integer' })
  plannedDurationSeconds!: number;
  @Column({ name: 'actual_duration_seconds', type: 'integer' })
  actualDurationSeconds!: number;
  @Column({ type: 'enum', enum: PomodoroHistoryStatus })
  status!: PomodoroHistoryStatus;
  @Index()
  @Column({ name: 'started_at', type: 'timestamptz' })
  startedAt!: Date;
  @Column({ name: 'ended_at', type: 'timestamptz' }) endedAt!: Date;
}
