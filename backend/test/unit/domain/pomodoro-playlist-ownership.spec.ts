import { expect, it, vi } from 'vitest';
import { PomodoroConfigurationService } from '../../../src/modules/pomodoro/application/services/pomodoro-configuration.service.js';
import { createPomodoro } from '../../../src/modules/pomodoro/application/services/pomodoro.factory.js';
import type { PomodoroConfigurationRepositoryInterface } from '../../../src/modules/pomodoro/application/interfaces/pomodoro-configuration.repository.interface.js';

const input = {
  name: 'Study',
  focusDurationSeconds: 1500,
  shortBreakDurationSeconds: 300,
  longBreakDurationSeconds: 900,
  focusSessionsBeforeLongBreak: 4,
  focusPlaylistId: null,
  breakPlaylistId: null,
};

function repositoryFixture() {
  return {
    save: vi.fn().mockResolvedValue(undefined),
    findByIdForUser: vi.fn().mockResolvedValue(createPomodoro('owner', input)),
    findAllForUser: vi.fn().mockResolvedValue([]),
    deleteForUser: vi.fn().mockResolvedValue(true),
    arePlaylistsOwnedByUser: vi.fn().mockResolvedValue(true),
  } satisfies PomodoroConfigurationRepositoryInterface;
}

it('rejects another user playlist before saving an update', async () => {
  const repository = repositoryFixture();
  repository.arePlaylistsOwnedByUser.mockResolvedValue(false);
  const service = new PomodoroConfigurationService(repository);
  await expect(
    service.update('owner', 'config', { ...input, focusPlaylistId: 'foreign' }),
  ).rejects.toMatchObject({ code: 'FORBIDDEN' });
  expect(repository.save).not.toHaveBeenCalled();
});

it('accepts null playlist references without an ownership lookup', async () => {
  const repository = repositoryFixture();
  const result = await new PomodoroConfigurationService(repository).update(
    'owner',
    'config',
    input,
  );
  expect(result.focusPlaylistId).toBeNull();
  expect(result.breakPlaylistId).toBeNull();
  expect(repository.arePlaylistsOwnedByUser).not.toHaveBeenCalled();
});

it('checks a shared Focus/Break playlist once for the current owner', async () => {
  const repository = repositoryFixture();
  await new PomodoroConfigurationService(repository).update('owner', 'config', {
    ...input,
    focusPlaylistId: 'shared',
    breakPlaylistId: 'shared',
  });
  expect(repository.arePlaylistsOwnedByUser).toHaveBeenCalledWith(
    ['shared'],
    'owner',
  );
});
