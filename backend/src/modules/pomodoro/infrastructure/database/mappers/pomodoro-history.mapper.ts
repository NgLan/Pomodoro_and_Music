import { PomodoroHistory } from '../../../domain/entities/pomodoro-history.entity.js';
import { PomodoroHistoryOrmEntity } from '../entities/pomodoro-history.orm-entity.js';

export function toHistoryDomain(entity: PomodoroHistoryOrmEntity): PomodoroHistory {
  return PomodoroHistory.create({ ...entity });
}

export function toHistoryPersistence(domain: PomodoroHistory): PomodoroHistoryOrmEntity {
  return Object.assign(new PomodoroHistoryOrmEntity(), {
    id: domain.id,
    userId: domain.userId,
    pomodoroId: domain.pomodoroId,
    phaseType: domain.phaseType,
    plannedDurationSeconds: domain.plannedDurationSeconds,
    actualDurationSeconds: domain.actualDurationSeconds,
    status: domain.status,
    startedAt: domain.startedAt,
    endedAt: domain.endedAt,
  });
}
