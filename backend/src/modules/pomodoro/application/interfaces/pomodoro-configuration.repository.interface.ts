import type { Pomodoro } from '../../domain/entities/pomodoro.entity.js';

export const POMODORO_CONFIGURATION_REPOSITORY = Symbol(
  'POMODORO_CONFIGURATION_REPOSITORY',
);

export interface PomodoroConfigurationRepositoryInterface {
  save(value: Pomodoro): Promise<void>;
  findByIdForUser(id: string, userId: string): Promise<Pomodoro | null>;
  findAllForUser(userId: string): Promise<Pomodoro[]>;
  deleteForUser(id: string, userId: string): Promise<boolean>;
  arePlaylistsOwnedByUser(ids: string[], userId: string): Promise<boolean>;
}
