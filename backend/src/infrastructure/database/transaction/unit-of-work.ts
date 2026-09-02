import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TransactionContext } from './transaction-context.js';
import type { TransactionCallback } from './transaction.types.js';
import type { UnitOfWork } from './unit-of-work.interface.js';

@Injectable()
export class TypeOrmUnitOfWork implements UnitOfWork {
  constructor(
    private readonly dataSource: DataSource,
    private readonly transactionContext: TransactionContext,
  ) {}

  execute<T>(callback: TransactionCallback<T>): Promise<T> {
    return this.dataSource.transaction((entityManager) =>
      this.transactionContext.run(entityManager, callback),
    );
  }
}
