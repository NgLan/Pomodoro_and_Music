import { BusinessException, ErrorCode } from '../../../../common/exceptions/index.js';
import type { PomodoroDurations } from '../entities/pomodoro.props.js';

export function validatePomodoroDurations(value: PomodoroDurations): void {
  const phaseDurations = [
    value.focusDurationSeconds,
    value.shortBreakDurationSeconds,
    value.longBreakDurationSeconds,
  ];
  if (phaseDurations.some((duration) => !Number.isFinite(duration) || duration <= 0)) {
    throw new BusinessException({
      code: ErrorCode.INVALID_POMODORO_DURATION,
      message: 'Pomodoro phase durations must be greater than zero',
    });
  }
  if (!Number.isInteger(value.focusSessionsBeforeLongBreak)
    || value.focusSessionsBeforeLongBreak < 1) {
    throw new BusinessException({
      code: ErrorCode.INVALID_FOCUS_SESSIONS_BEFORE_LONG_BREAK,
      message: 'Focus sessions before long break must be at least one',
    });
  }
}
