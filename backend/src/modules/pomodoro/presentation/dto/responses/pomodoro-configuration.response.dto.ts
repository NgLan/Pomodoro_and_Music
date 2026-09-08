import { ApiProperty } from '@nestjs/swagger';
import type { Pomodoro } from '../../../domain/entities/pomodoro.entity.js';

export class PomodoroConfigurationResponseDto {
  @ApiProperty({ format: 'uuid' }) id!: string;
  @ApiProperty() name!: string;
  @ApiProperty() focusDurationSeconds!: number;
  @ApiProperty() shortBreakDurationSeconds!: number;
  @ApiProperty() longBreakDurationSeconds!: number;
  @ApiProperty() focusSessionsBeforeLongBreak!: number;
  @ApiProperty({ type: String, format: 'uuid', nullable: true })
  focusPlaylistId!: string | null;
  @ApiProperty({ type: String, format: 'uuid', nullable: true })
  breakPlaylistId!: string | null;
  @ApiProperty() isDefault!: boolean;
  @ApiProperty({ format: 'date-time' }) createdAt!: string;
  @ApiProperty({ format: 'date-time' }) updatedAt!: string;
  @ApiProperty({
    type: String,
    format: 'date-time',
    nullable: true,
    required: false,
  })
  deletedAt?: string | null;

  static fromDomain(value: Pomodoro): PomodoroConfigurationResponseDto {
    return {
      id: value.id,
      name: value.name,
      focusDurationSeconds: value.focusDurationSeconds,
      shortBreakDurationSeconds: value.shortBreakDurationSeconds,
      longBreakDurationSeconds: value.longBreakDurationSeconds,
      focusSessionsBeforeLongBreak: value.focusSessionsBeforeLongBreak,
      focusPlaylistId: value.focusPlaylistId,
      breakPlaylistId: value.breakPlaylistId,
      isDefault: value.isDefault,
      createdAt: value.createdAt.toISOString(),
      updatedAt: value.updatedAt.toISOString(),
      deletedAt: value.deletedAt ? value.deletedAt.toISOString() : null,
    };
  }
}
