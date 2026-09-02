import { Client } from 'pg';
import { InfrastructureException } from '../common/exceptions/infrastructure.exception.js';

interface DatabaseAdminClient {
  connect(): Promise<void>;
  query(text: string, values?: unknown[]): Promise<{ rowCount: number | null }>;
  end(): Promise<void>;
}

export type DatabaseAdminClientFactory = (
  connectionString: string,
) => DatabaseAdminClient;

const POSTGRES_DATABASE_ALREADY_EXISTS = '42P04';

function createAdminClient(connectionString: string): DatabaseAdminClient {
  const client = new Client({ connectionString });
  return {
    connect: async () => {
      await client.connect();
    },
    query: async (text, values) => client.query(text, values),
    end: () => client.end(),
  };
}

function quoteIdentifier(identifier: string): string {
  return `"${identifier.replaceAll('"', '""')}"`;
}

function parseDatabaseLocation(databaseUrl: string): {
  databaseName: string;
  adminUrl: string;
} {
  const targetUrl = new URL(databaseUrl);
  const databaseName = decodeURIComponent(targetUrl.pathname.slice(1));
  if (databaseName.length === 0 || databaseName.includes('/')) {
    throw new Error('DATABASE_URL must include exactly one database name');
  }

  targetUrl.pathname = '/postgres';
  return {
    databaseName,
    adminUrl: targetUrl.toString(),
  };
}

/**
 * Creates the configured PostgreSQL database when it does not exist.
 *
 * @returns true when this call created the database.
 * @throws InfrastructureException when the admin connection or CREATE DATABASE
 * operation fails.
 */
export async function ensureDatabaseExists(
  databaseUrl: string,
  clientFactory: DatabaseAdminClientFactory = createAdminClient,
): Promise<boolean> {
  let client: DatabaseAdminClient | undefined;
  let initializationError: unknown;
  let databaseWasCreated = false;
  try {
    const { databaseName, adminUrl } = parseDatabaseLocation(databaseUrl);
    client = clientFactory(adminUrl);
    await client.connect();

    const existingDatabase = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [databaseName],
    );
    if (!existingDatabase.rowCount || existingDatabase.rowCount === 0) {
      try {
        await client.query(`CREATE DATABASE ${quoteIdentifier(databaseName)}`);
        databaseWasCreated = true;
      } catch (error) {
        if (
          typeof error !== 'object' ||
          error === null ||
          !('code' in error) ||
          error.code !== POSTGRES_DATABASE_ALREADY_EXISTS
        ) {
          throw error;
        }
      }
    }
  } catch (error) {
    initializationError = error;
  }

  let closingError: unknown;
  try {
    await client?.end();
  } catch (error) {
    closingError = error;
  }

  if (initializationError) {
    throw new InfrastructureException(
      initializationError,
      'Unable to initialize the PostgreSQL database',
    );
  }
  if (closingError) {
    throw new InfrastructureException(
      closingError,
      'Unable to close the PostgreSQL admin connection',
    );
  }

  return databaseWasCreated;
}
