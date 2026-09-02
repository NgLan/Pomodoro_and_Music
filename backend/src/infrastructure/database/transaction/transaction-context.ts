import { AsyncLocalStorage } from 'node:async_hooks';
import { Injectable } from '@nestjs/common';
import type { EntityManager } from 'typeorm';

@Injectable()
export class TransactionContext {
  private readonly storage = new AsyncLocalStorage<EntityManager>();

  run<T>(entityManager: EntityManager, callback: () => T): T {
    return this.storage.run(entityManager, callback);
  }

  getEntityManager(): EntityManager | undefined {
    return this.storage.getStore();
  }
}
