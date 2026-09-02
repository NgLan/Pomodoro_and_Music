import { ErrorCode } from '../../../src/common/exceptions/error-code.enum.js';
import { PomodoroHistory } from '../../../src/domain/pomodoro/entities/pomodoro-history.entity.js';
import { Pomodoro } from '../../../src/domain/pomodoro/entities/pomodoro.entity.js';
import { PomodoroHistoryStatus } from '../../../src/domain/pomodoro/enums/pomodoro-history-status.enum.js';
import { PomodoroPhaseType } from '../../../src/domain/pomodoro/enums/pomodoro-phase-type.enum.js';

const NOW = new Date('2026-01-01T00:00:00.000Z');

function createPomodoro(
  overrides: Partial<Parameters<typeof Pomodoro.create>[0]> = {},
) {
  return Pomodoro.create({
    id: 'pomodoro-1',
    userId: 'user-1',
    name: 'Default',
    focusDurationSeconds: 1_500,
    shortBreakDurationSeconds: 300,
    longBreakDurationSeconds: 900,
    focusSessionsBeforeLongBreak: 4,
    focusPlaylistId: null,
    breakPlaylistId: null,
    isDefault: true,
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  });
}

function createHistory(
  overrides: Partial<Parameters<typeof PomodoroHistory.create>[0]> = {},
) {
  return PomodoroHistory.create({
    id: 'history-1',
    userId: 'user-1',
    pomodoroId: null,
    phaseType: PomodoroPhaseType.FOCUS,
    status: PomodoroHistoryStatus.COMPLETED,
    plannedDurationSeconds: 1_500,
    actualDurationSeconds: 1_500,
    startedAt: NOW,
    endedAt: new Date('2026-01-01T00:25:00.000Z'),
    ...overrides,
  });
}

describe('Pomodoro domain', () => {
  it('accepts positive durations, at least one focus session, and null playlists', () => {
    const pomodoro = createPomodoro();

    expect(pomodoro.focusPlaylistId).toBeNull();
    expect(pomodoro.breakPlaylistId).toBeNull();
  });

  it.each([
    ['focusDurationSeconds', 0],
    ['focusDurationSeconds', -1],
    ['shortBreakDurationSeconds', 0],
    ['shortBreakDurationSeconds', -1],
    ['longBreakDurationSeconds', 0],
    ['longBreakDurationSeconds', -1],
  ] as const)('rejects invalid %s value %s', (field, value) => {
    expect(() => createPomodoro({ [field]: value })).toThrowError(
      expect.objectContaining({ code: ErrorCode.INVALID_POMODORO_DURATION }),
    );
  });

  it.each([0, -1])(
    'rejects focusSessionsBeforeLongBreak value %s',
    (focusSessionsBeforeLongBreak) => {
      expect(() =>
        createPomodoro({ focusSessionsBeforeLongBreak }),
      ).toThrowError(
        expect.objectContaining({
          code: ErrorCode.INVALID_FOCUS_SESSIONS_BEFORE_LONG_BREAK,
        }),
      );
    },
  );

  it('does not corrupt state when a duration update is invalid', () => {
    const pomodoro = createPomodoro();

    expect(() =>
      pomodoro.updateDurations({ shortBreakDurationSeconds: 0 }),
    ).toThrowError(
      expect.objectContaining({ code: ErrorCode.INVALID_POMODORO_DURATION }),
    );
    expect(pomodoro.shortBreakDurationSeconds).toBe(300);
  });
});

describe('PomodoroHistory domain', () => {
  it.each(Object.values(PomodoroHistoryStatus))(
    'accepts status %s with a nullable pomodoro reference',
    (status) => {
      const history = createHistory({ status, pomodoroId: null });

      expect(history.status).toBe(status);
      expect(history.pomodoroId).toBeNull();
    },
  );

  it('allows actual duration to exceed planned duration', () => {
    expect(() => createHistory({ actualDurationSeconds: 1_800 })).not.toThrow();
  });

  it.each([
    { plannedDurationSeconds: 0 },
    { plannedDurationSeconds: -1 },
    { actualDurationSeconds: -1 },
  ])('rejects invalid history duration %#', (override) => {
    expect(() => createHistory(override)).toThrowError(
      expect.objectContaining({
        code: ErrorCode.INVALID_POMODORO_HISTORY_DURATION,
      }),
    );
  });

  it('rejects an end time before the start time', () => {
    expect(() =>
      createHistory({ endedAt: new Date('2025-12-31T23:59:59.000Z') }),
    ).toThrowError(
      expect.objectContaining({
        code: ErrorCode.INVALID_POMODORO_HISTORY_RANGE,
      }),
    );
  });
});
