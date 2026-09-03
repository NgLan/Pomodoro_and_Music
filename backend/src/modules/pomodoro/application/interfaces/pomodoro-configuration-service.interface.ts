import type { Pomodoro } from '../../domain/entities/pomodoro.entity.js';
import type { PomodoroConfigurationInput } from '../inputs/pomodoro-configuration.input.js';

export interface PomodoroConfigurationServiceInterface {
  create(userId: string, input: PomodoroConfigurationInput): Promise<Pomodoro>;
  list(userId: string): Promise<Pomodoro[]>;
  get(userId: string, id: string): Promise<Pomodoro>;
  update(userId: string, id: string, input: PomodoroConfigurationInput): Promise<Pomodoro>;
  delete(userId: string, id: string): Promise<void>;
}
