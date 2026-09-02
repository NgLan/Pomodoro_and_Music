import { join } from 'node:path';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import type { DataSourceOptions } from 'typeorm';
import type { DatabaseConfig } from '../common/config/config.types.js';

type PostgresDataSourceOptions = Extract<
  DataSourceOptions,
  { type: 'postgres' }
>;

const MIGRATIONS_PATTERN = join(
  import.meta.dirname,
  'migrations',
  '**',
  '*{.js,.ts}',
);
const ENTITIES_PATTERN = join(
  import.meta.dirname,
  '..',
  'modules',
  '**',
  '*.orm-entity{.js,.ts}',
);

export function createDataSourceOptions(
  configuration: DatabaseConfig,
  migrationsRun: boolean,
): PostgresDataSourceOptions {
  return {
    type: 'postgres',
    url: configuration.url,
    entities: [ENTITIES_PATTERN],
    migrations: [MIGRATIONS_PATTERN],
    migrationsRun,
    migrationsTableName: 'typeorm_migrations',
    migrationsTransactionMode: 'all',
    synchronize: false,
    logging: false,
    invalidWhereValuesBehavior: {
      null: 'throw',
      undefined: 'throw',
    },
  };
}

export function createNestTypeOrmOptions(
  configuration: DatabaseConfig,
): TypeOrmModuleOptions {
  return {
    ...createDataSourceOptions(configuration, true),
    autoLoadEntities: true,
    retryAttempts: 5,
    retryDelay: 3_000,
  };
}
