import { ErrorCode } from '../../../src/common/exceptions/error-code.enum.js';
import { User } from '../../../src/modules/user/domain/entities/user.entity.js';
import { AuthProvider } from '../../../src/modules/user/domain/enums/auth-provider.enum.js';
import { UserStatus } from '../../../src/modules/user/domain/enums/user-status.enum.js';

const NOW = new Date('2026-01-01T00:00:00.000Z');

function createUser(
  overrides: Partial<Parameters<typeof User.create>[0]> = {},
) {
  return User.create({
    id: 'user-1',
    email: 'user@example.com',
    displayName: 'User',
    passwordHash: 'password-hash',
    authProvider: AuthProvider.LOCAL,
    providerSubject: null,
    status: UserStatus.ACTIVE,
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  });
}

describe('User domain', () => {
  it('accepts a local user without an external provider subject', () => {
    expect(createUser().authProvider).toBe(AuthProvider.LOCAL);
  });

  it('accepts a Google user with a provider subject', () => {
    const user = createUser({
      authProvider: AuthProvider.GOOGLE,
      providerSubject: 'google-subject',
      passwordHash: null,
    });

    expect(user.providerSubject).toBe('google-subject');
  });

  it.each([
    { authProvider: AuthProvider.GOOGLE, providerSubject: null },
    { authProvider: AuthProvider.GOOGLE, providerSubject: '  ' },
    { authProvider: AuthProvider.LOCAL, providerSubject: 'google-subject' },
  ])('rejects invalid provider configuration %#', (override) => {
    expect(() => createUser(override)).toThrowError(
      expect.objectContaining({
        code: ErrorCode.INVALID_AUTH_PROVIDER_CONFIGURATION,
      }),
    );
  });
});
