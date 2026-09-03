import { randomUUID } from 'node:crypto';
import { Pomodoro } from '../../domain/entities/pomodoro.entity.js';
import { PomodoroHistory } from '../../domain/entities/pomodoro-history.entity.js';
import type { CreatePomodoroHistoryInput } from '../inputs/create-pomodoro-history.input.js';
import type { PomodoroConfigurationInput } from '../inputs/pomodoro-configuration.input.js';

export function createPomodoro(
  userId: string,
  input: PomodoroConfigurationInput,
  current?: Pomodoro,
): Pomodoro {
  const now = new Date();
  return Pomodoro.create({
    id: current?.id ?? randomUUID(),
    userId,
    name: input.name.trim(),
    focusDurationSeconds: input.focusDurationSeconds,
    shortBreakDurationSeconds: input.shortBreakDurationSeconds,
    longBreakDurationSeconds: input.longBreakDurationSeconds,
    focusSessionsBeforeLongBreak: input.focusSessionsBeforeLongBreak,
    focusPlaylistId: input.focusPlaylistId ?? null,
    breakPlaylistId: input.breakPlaylistId ?? null,
    isDefault: current?.isDefault ?? false,
    createdAt: current?.createdAt ?? now,
    updatedAt: now,
  });
}

export function createHistory(userId: string, input: CreatePomodoroHistoryInput): PomodoroHistory {
  return PomodoroHistory.create({
    id: randomUUID(),
    userId,
    pomodoroId: input.pomodoroId ?? null,
    phaseType: input.phaseType,
    plannedDurationSeconds: input.plannedDurationSeconds,
    actualDurationSeconds: input.actualDurationSeconds,
    status: input.status,
    startedAt: input.startedAt,
    endedAt: input.endedAt,
  });
}
