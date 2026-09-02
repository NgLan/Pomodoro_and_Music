import type { EntityManager } from 'typeorm';
import {
  ErrorCode,
  InfrastructureException,
} from '../../../src/common/exceptions/index.js';
import {
  ensureDatabaseExists,
  type DatabaseAdminClientFactory,
} from '../../../src/infrastructure/database/database-initializer.js';
import { TransactionContext } from '../../../src/infrastructure/database/transaction/transaction-context.js';
import { TypeOrmUnitOfWork } from '../../../src/infrastructure/database/transaction/unit-of-work.js';
import { createNestTypeOrmOptions } from '../../../src/infrastructure/database/typeorm-options.js';
import { InitialSchema1788360000000 } from '../../../src/infrastructure/database/migrations/1788360000000-initial-schema.js';
import { DatabaseReadinessService } from '../../../src/infrastructure/database/database-readiness.service.js';

function createAdminClient(options?: {
  existingRowCount?: number;
  createError?: unknown;
}) {
  const queries: Array<{ text: string; values?: unknown[] }> = [];
  const client = {
    connect: vi.fn().mockResolvedValue(undefined),
    query: vi.fn(async (text: string, values?: unknown[]) => {
      queries.push({ text, values });
      if (text.startsWith('SELECT')) {
        return { rowCount: options?.existingRowCount ?? 0 };
      }
      if (options?.createError) {
        throw options.createError;
      }
      return { rowCount: null };
    }),
    end: vi.fn().mockResolvedValue(undefined),
  };

  return { client, queries };
}

describe('database foundation', () => {
  it('uses migrations as the only schema source of truth', () => {
    const options = createNestTypeOrmOptions({
      url: 'postgresql://localhost/application',
    });

    expect(options).toMatchObject({
      type: 'postgres',
      migrationsRun: true,
      synchronize: false,
      autoLoadEntities: true,
      migrationsTableName: 'typeorm_migrations',
    });
  });

  describe('database initializer', () => {
    it('creates a missing database with a safely quoted identifier', async () => {
      const { client, queries } = createAdminClient();
      let adminUrl: string | undefined;
      const factory: DatabaseAdminClientFactory = (connectionString) => {
        adminUrl = connectionString;
        return client;
      };

      await expect(
        ensureDatabaseExists(
          'postgresql://user:password@localhost:5432/app%22database',
          factory,
        ),
      ).resolves.toBe(true);

      expect(new URL(adminUrl!).pathname).toBe('/postgres');
      expect(queries).toEqual([
        {
          text: 'SELECT 1 FROM pg_database WHERE datname = $1',
          values: ['app"database'],
        },
        {
          text: 'CREATE DATABASE "app""database"',
          values: undefined,
        },
      ]);
      expect(client.end).toHaveBeenCalledOnce();
    });

    it('does not create a database that already exists', async () => {
      const { client, queries } = createAdminClient({ existingRowCount: 1 });

      await expect(
        ensureDatabaseExists('postgresql://localhost/existing', () => client),
      ).resolves.toBe(false);

      expect(queries).toHaveLength(1);
    });

    it('treats a concurrent duplicate database creation as success', async () => {
      const { client } = createAdminClient({
        createError: { code: '42P04' },
      });

      await expect(
        ensureDatabaseExists('postgresql://localhost/raced', () => client),
      ).resolves.toBe(false);
    });

    it('preserves the original database error and closes the client', async () => {
      const cause = new Error('permission denied');
      const { client } = createAdminClient({ createError: cause });

      const result = ensureDatabaseExists(
        'postgresql://localhost/forbidden',
        () => client,
      );

      await expect(result).rejects.toBeInstanceOf(InfrastructureException);
      await expect(result).rejects.toMatchObject({
        code: ErrorCode.DATABASE_INITIALIZATION_FAILED,
        cause,
      });
      expect(client.end).toHaveBeenCalledOnce();
    });
  });

  it('defines the initial migration for all schema tables', async () => {
    const query = vi.fn().mockResolvedValue(undefined);

    await new InitialSchema1788360000000().up({ query } as never);

    const migrationSql = String(query.mock.calls[0]?.[0]);
    expect(migrationSql.match(/CREATE TABLE /g)).toHaveLength(8);
    for (const table of [
      'users',
      'refresh_tokens',
      'user_settings',
      'playlists',
      'media_items',
      'playlist_items',
      'pomodoro',
      'pomodoro_history',
    ]) {
      expect(migrationSql).toContain(`CREATE TABLE ${table}`);
    }
  });

  it('translates a readiness failure with a detailed infrastructure code', async () => {
    const cause = new Error('connection refused');
    const readiness = new DatabaseReadinessService({
      query: vi.fn().mockRejectedValue(cause),
    } as never);

    await expect(readiness.assertReady()).rejects.toMatchObject({
      code: ErrorCode.DATABASE_NOT_READY,
      cause,
    });
  });

  describe('unit of work', () => {
    it('commits by resolving the callback result', async () => {
      const entityManager = {} as EntityManager;
      const dataSource = {
        transaction: vi.fn(
          (callback: (manager: EntityManager) => Promise<string>) =>
            callback(entityManager),
        ),
      };
      const transactionContext = new TransactionContext();
      const unitOfWork = new TypeOrmUnitOfWork(
        dataSource as never,
        transactionContext,
      );

      await expect(
        unitOfWork.execute(async () => {
          expect(transactionContext.getEntityManager()).toBe(entityManager);
          return 'committed';
        }),
      ).resolves.toBe('committed');
    });

    it('preserves the original exception so TypeORM can roll back', async () => {
      const cause = new Error('write failed');
      const dataSource = {
        transaction: vi.fn(
          async (callback: (manager: EntityManager) => Promise<unknown>) =>
            callback({} as EntityManager),
        ),
      };
      const unitOfWork = new TypeOrmUnitOfWork(
        dataSource as never,
        new TransactionContext(),
      );

      await expect(
        unitOfWork.execute(() => Promise.reject(cause)),
      ).rejects.toBe(cause);
    });
  });
});
