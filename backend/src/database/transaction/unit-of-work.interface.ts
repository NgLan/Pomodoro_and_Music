import type { TransactionCallback } from './transaction.types.js';

export const UNIT_OF_WORK = Symbol('UNIT_OF_WORK');

export interface UnitOfWork {
  execute<T>(callback: TransactionCallback<T>): Promise<T>;
}
