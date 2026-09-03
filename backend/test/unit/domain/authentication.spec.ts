import { ErrorCode } from '../../../src/common/exceptions/error-code.enum.js';
import { RefreshToken } from '../../../src/modules/authentication/domain/entities/refresh-token.entity.js';

const CREATED_AT = new Date('2026-01-01T00:00:00.000Z');
const EXPIRES_AT = new Date('2026-01-08T00:00:00.000Z');

function createRefreshToken() {
  return RefreshToken.create({
    id: 'token-1',
    userId: 'user-1',
    tokenHash: 'one-way-hash',
    expiresAt: EXPIRES_AT,
    revokedAt: null,
    createdAt: CREATED_AT,
  });
}

describe('RefreshToken domain', () => {
  it('is active before expiry and expires at the exact expiry time', () => {
    const token = createRefreshToken();

    expect(token.isActive(new Date('2026-01-07T23:59:59.999Z'))).toBe(true);
    expect(token.isExpired(EXPIRES_AT)).toBe(true);
    expect(token.isActive(EXPIRES_AT)).toBe(false);
  });

  it('becomes inactive when revoked and records the supplied time', () => {
    const token = createRefreshToken();
    const revokedAt = new Date('2026-01-02T00:00:00.000Z');

    token.revoke(revokedAt);

    expect(token.isRevoked()).toBe(true);
    expect(token.isActive(new Date('2026-01-03T00:00:00.000Z'))).toBe(false);
    expect(token.revokedAt).toEqual(revokedAt);
  });

  it('rejects expiry or revocation before creation', () => {
    expect(() =>
      RefreshToken.create({
        id: 'token-1',
        userId: 'user-1',
        tokenHash: 'hash',
        expiresAt: CREATED_AT,
        revokedAt: null,
        createdAt: CREATED_AT,
      }),
    ).toThrowError(
      expect.objectContaining({ code: ErrorCode.INVALID_REFRESH_TOKEN_EXPIRY }),
    );

    expect(() =>
      createRefreshToken().revoke(new Date('2025-12-31T23:59:59.000Z')),
    ).toThrowError(
      expect.objectContaining({
        code: ErrorCode.INVALID_REFRESH_TOKEN_REVOCATION,
      }),
    );
  });

  it('contains only a hash and never a raw token field', () => {
    const token = createRefreshToken();

    expect(token.tokenHash).toBe('one-way-hash');
    expect('rawToken' in token).toBe(false);
  });
});
