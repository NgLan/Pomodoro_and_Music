import { Pomodoro } from '../../../domain/entities/pomodoro.entity.js';
import { PomodoroOrmEntity } from '../entities/pomodoro.orm-entity.js';

export function toPomodoroDomain(entity: PomodoroOrmEntity): Pomodoro {
  return Pomodoro.create({ ...entity });
}

export function toPomodoroPersistence(domain: Pomodoro): PomodoroOrmEntity {
  return Object.assign(new PomodoroOrmEntity(), {
    id: domain.id,
    userId: domain.userId,
    name: domain.name,
    focusDurationSeconds: domain.focusDurationSeconds,
    shortBreakDurationSeconds: domain.shortBreakDurationSeconds,
    longBreakDurationSeconds: domain.longBreakDurationSeconds,
    focusSessionsBeforeLongBreak: domain.focusSessionsBeforeLongBreak,
    focusPlaylistId: domain.focusPlaylistId,
    breakPlaylistId: domain.breakPlaylistId,
    isDefault: domain.isDefault,
    createdAt: domain.createdAt,
    updatedAt: domain.updatedAt,
  });
}
