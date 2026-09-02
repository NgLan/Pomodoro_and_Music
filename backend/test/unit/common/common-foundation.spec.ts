import { validateEnvironment } from '../../../src/common/config/env.schema.js';
import { PaginationQueryDto } from '../../../src/common/dto/pagination-query.dto.js';
import { BusinessException } from '../../../src/common/exceptions/business.exception.js';
import { ErrorCode } from '../../../src/common/exceptions/error-code.enum.js';
import { ERROR_STATUS } from '../../../src/common/filters/error-status.map.js';
import { redactSensitiveData } from '../../../src/common/logging/sensitive-data-redactor.js';
import { AppValidationPipe } from '../../../src/common/pipes/validation.pipe.js';
import { generateRandomToken } from '../../../src/common/security/random-token.js';
import { hashToken } from '../../../src/common/security/token-hash.js';
import {
  isValidRequestId,
  resolveRequestId,
} from '../../../src/common/utils/request-id.util.js';

const VALID_ENVIRONMENT = {
  NODE_ENV: 'test',
  PORT: '3100',
  DATABASE_URL: 'postgresql://user:password@localhost:5432/app',
  JWT_ACCESS_SECRET: 'a-secure-test-secret-with-32-characters',
  JWT_ACCESS_TTL: '15m',
  REFRESH_TOKEN_TTL: '7d',
  YOUTUBE_API_KEY: 'youtube-test-key',
  FRONTEND_ORIGIN: 'http://localhost:5173',
  LOG_LEVEL: 'error',
};

describe('common foundation', () => {
  describe('environment validation', () => {
    it('normalizes a valid environment', () => {
      expect(validateEnvironment(VALID_ENVIRONMENT)).toMatchObject({
        NODE_ENV: 'test',
        PORT: 3100,
        LOG_LEVEL: 'error',
      });
    });

    it('fails fast when a required value is missing', () => {
      const { DATABASE_URL: _, ...environment } = VALID_ENVIRONMENT;
      expect(() => validateEnvironment(environment)).toThrow(
        'Environment variable DATABASE_URL is required',
      );
    });

    it('rejects invalid types and ranges', () => {
      expect(() =>
        validateEnvironment({ ...VALID_ENVIRONMENT, PORT: '70000' }),
      ).toThrow('PORT must be an integer');
      expect(() =>
        validateEnvironment({
          ...VALID_ENVIRONMENT,
          JWT_ACCESS_SECRET: 'short',
        }),
      ).toThrow('JWT_ACCESS_SECRET must contain at least 32 characters');
    });
  });

  describe('errors', () => {
    it('maps every stable error code to an HTTP status', () => {
      expect(Object.keys(ERROR_STATUS).sort()).toEqual(
        Object.values(ErrorCode).sort(),
      );
    });

    it('preserves business exception details and cause', () => {
      const cause = new Error('original');
      const exception = new BusinessException({
        code: ErrorCode.CONFLICT,
        message: 'Already exists',
        details: [{ field: 'name', message: 'Name is already used' }],
        cause,
      });

      expect(exception.cause).toBe(cause);
      expect(exception.details).toEqual([
        { field: 'name', message: 'Name is already used' },
      ]);
    });
  });

  describe('validation', () => {
    const pipe = new AppValidationPipe();

    it('transforms controlled pagination query fields', async () => {
      await expect(
        pipe.transform(
          { page: '2', pageSize: '50', sortOrder: 'desc' },
          { type: 'query', metatype: PaginationQueryDto },
        ),
      ).resolves.toMatchObject({
        page: 2,
        pageSize: 50,
        sortOrder: 'desc',
      });
    });

    it('rejects fields outside the DTO contract', async () => {
      await expect(
        pipe.transform(
          { unexpected: 'value' },
          { type: 'query', metatype: PaginationQueryDto },
        ),
      ).rejects.toMatchObject({
        code: ErrorCode.INVALID_INPUT,
        message: 'Invalid request',
      });
    });
  });

  describe('logging redaction', () => {
    it('redacts sensitive values recursively without mutating input', () => {
      const input = {
        user: { password: 'secret', displayName: 'Ada' },
        authorization: 'Bearer token',
        nested: [{ api_key: 'key' }],
      };

      expect(redactSensitiveData(input)).toEqual({
        user: { password: '[REDACTED]', displayName: 'Ada' },
        authorization: '[REDACTED]',
        nested: [{ api_key: '[REDACTED]' }],
      });
      expect(input.user.password).toBe('secret');
    });
  });

  describe('request and security identifiers', () => {
    it('accepts safe request IDs and replaces invalid IDs', () => {
      expect(isValidRequestId('request-123')).toBe(true);
      expect(isValidRequestId('invalid request id')).toBe(false);
      expect(resolveRequestId('invalid request id')).toMatch(/^[0-9a-f-]{36}$/);
    });

    it('generates high-entropy tokens and stable one-way hashes', () => {
      const token = generateRandomToken();
      expect(token).not.toEqual(generateRandomToken());
      expect(Buffer.from(token, 'base64url')).toHaveLength(32);
      expect(hashToken('token')).toBe(
        '3c469e9d6c5875d37a43f353d4f88e61fcf812c66eee3457465a40b0da4153e0',
      );
    });
  });
});
