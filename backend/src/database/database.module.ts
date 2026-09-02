import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, type DataSourceOptions } from 'typeorm';
import { databaseConfig } from '../common/config/index.js';
import { ensureDatabaseExists } from './database-initializer.js';
import { createNestTypeOrmOptions } from './typeorm-options.js';
import { TransactionContext } from './transaction/transaction-context.js';
import { UNIT_OF_WORK } from './transaction/unit-of-work.interface.js';
import { TypeOrmUnitOfWork } from './transaction/unit-of-work.js';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [databaseConfig.KEY],
      useFactory: createNestTypeOrmOptions,
      dataSourceFactory: async (options) => {
        if (
          !options ||
          options.type !== 'postgres' ||
          !('url' in options) ||
          typeof options.url !== 'string'
        ) {
          throw new Error('TypeORM requires a PostgreSQL DATABASE_URL');
        }
        await ensureDatabaseExists(options.url);
        return new DataSource(options as DataSourceOptions).initialize();
      },
    }),
  ],
  providers: [
    TransactionContext,
    TypeOrmUnitOfWork,
    {
      provide: UNIT_OF_WORK,
      useExisting: TypeOrmUnitOfWork,
    },
  ],
  exports: [TypeOrmModule, TransactionContext, UNIT_OF_WORK],
})
export class DatabaseModule {}
