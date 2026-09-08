import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, type DataSourceOptions } from 'typeorm';
import type {
  AppConfig,
  DatabaseConfig,
} from '../../common/config/config.types.js';
import {
  ErrorCode,
  InfrastructureException,
} from '../../common/exceptions/index.js';
import { appConfig, databaseConfig } from '../../common/config/index.js';
import { ensureDatabaseExists } from './database-initializer.js';
import { DatabaseReadinessService } from './database-readiness.service.js';
import { createNestTypeOrmOptions } from './typeorm-options.js';
import { TransactionContext } from './transaction/transaction-context.js';
import { UNIT_OF_WORK } from './transaction/unit-of-work.interface.js';
import { TypeOrmUnitOfWork } from './transaction/unit-of-work.js';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [databaseConfig.KEY, appConfig.KEY],
      useFactory: (database: DatabaseConfig, application: AppConfig) =>
        createNestTypeOrmOptions(database, application.nodeEnv),
      dataSourceFactory: async (options) => {
        if (
          !options ||
          options.type !== 'postgres' ||
          !('url' in options) ||
          typeof options.url !== 'string'
        ) {
          throw new Error('TypeORM requires a PostgreSQL DATABASE_URL');
        }
        if (options.migrationsRun) {
          await ensureDatabaseExists(options.url);
        }
        try {
          return await new DataSource(
            options as DataSourceOptions,
          ).initialize();
        } catch (error) {
          throw new InfrastructureException({
            code: ErrorCode.DATABASE_CONNECTION_FAILED,
            message: 'Unable to initialize the TypeORM data source',
            cause: error,
          });
        }
      },
    }),
  ],
  providers: [
    DatabaseReadinessService,
    TransactionContext,
    TypeOrmUnitOfWork,
    {
      provide: UNIT_OF_WORK,
      useExisting: TypeOrmUnitOfWork,
    },
  ],
  exports: [
    TypeOrmModule,
    DatabaseReadinessService,
    TransactionContext,
    UNIT_OF_WORK,
  ],
})
export class DatabaseModule {}
