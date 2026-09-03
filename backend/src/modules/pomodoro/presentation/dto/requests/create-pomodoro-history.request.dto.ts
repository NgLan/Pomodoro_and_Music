import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';
import { PomodoroHistoryStatus } from '../../../domain/enums/pomodoro-history-status.enum.js';
import { PomodoroPhaseType } from '../../../domain/enums/pomodoro-phase-type.enum.js';

export class CreatePomodoroHistoryRequestDto {
  @ApiPropertyOptional({ type: String, format: 'uuid', nullable: true })
  @IsOptional()
  @IsUUID()
  pomodoroId?: string | null;

  @ApiProperty({ enum: PomodoroPhaseType, enumName: 'PomodoroPhaseType' })
  @IsEnum(PomodoroPhaseType)
  phaseType!: PomodoroPhaseType;

  @ApiProperty({ example: 1500 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  plannedDurationSeconds!: number;

  @ApiProperty({ example: 1500 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  actualDurationSeconds!: number;

  @ApiProperty({
    enum: PomodoroHistoryStatus,
    enumName: 'PomodoroHistoryStatus',
  })
  @IsEnum(PomodoroHistoryStatus)
  status!: PomodoroHistoryStatus;

  @ApiProperty({ format: 'date-time' })
  @IsDateString()
  startedAt!: string;

  @ApiProperty({ format: 'date-time' })
  @IsDateString()
  endedAt!: string;
}
