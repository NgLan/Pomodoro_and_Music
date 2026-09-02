import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  ErrorCode,
  InfrastructureException,
} from '../../common/exceptions/index.js';

@Injectable()
export class DatabaseReadinessService {
  constructor(private readonly dataSource: DataSource) {}

  async assertReady(): Promise<void> {
    try {
      await this.dataSource.query('SELECT 1');
    } catch (error) {
      throw new InfrastructureException({
        code: ErrorCode.DATABASE_NOT_READY,
        message: 'Database readiness query failed',
        cause: error,
      });
    }
  }
}
