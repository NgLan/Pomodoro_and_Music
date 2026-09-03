import { ApiProperty } from '@nestjs/swagger';
import type { PomodoroHistoryRecordOutput } from '../../../application/outputs/pomodoro-history-record.output.js';
import { PomodoroHistoryStatus } from '../../../domain/enums/pomodoro-history-status.enum.js';
import { PomodoroPhaseType } from '../../../domain/enums/pomodoro-phase-type.enum.js';

export class PomodoroHistoryResponseDto {
  @ApiProperty({ format: 'uuid' }) id!: string;
  @ApiProperty({ type: String, format: 'uuid', nullable: true }) pomodoroId!:
    string | null;
  @ApiProperty({ type: String, nullable: true }) configurationName!:
    string | null;
  @ApiProperty({ enum: PomodoroPhaseType, enumName: 'PomodoroPhaseType' })
  phaseType!: PomodoroPhaseType;
  @ApiProperty() plannedDurationSeconds!: number;
  @ApiProperty() actualDurationSeconds!: number;
  @ApiProperty({
    enum: PomodoroHistoryStatus,
    enumName: 'PomodoroHistoryStatus',
  })
  status!: PomodoroHistoryStatus;
  @ApiProperty({ format: 'date-time' }) startedAt!: string;
  @ApiProperty({ format: 'date-time' }) endedAt!: string;

  static fromRecord(
    record: PomodoroHistoryRecordOutput,
  ): PomodoroHistoryResponseDto {
    const value = record.history;
    return {
      id: value.id,
      pomodoroId: value.pomodoroId,
      configurationName: record.configurationName,
      phaseType: value.phaseType,
      plannedDurationSeconds: value.plannedDurationSeconds,
      actualDurationSeconds: value.actualDurationSeconds,
      status: value.status,
      startedAt: value.startedAt.toISOString(),
      endedAt: value.endedAt.toISOString(),
    };
  }
}
