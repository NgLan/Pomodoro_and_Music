import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InfrastructureException } from '../common/exceptions/infrastructure.exception.js';
import type {
  LivenessResponseDto,
  ReadinessResponseDto,
} from './health-response.dto.js';

@Injectable()
export class HealthService {
  constructor(private readonly dataSource: DataSource) {}

  getLiveness(): LivenessResponseDto {
    return { status: 'ok' };
  }

  async getReadiness(): Promise<ReadinessResponseDto> {
    try {
      await this.dataSource.query('SELECT 1');
      return {
        status: 'ready',
        checks: {
          application: 'up',
          database: 'up',
        },
      };
    } catch (error) {
      throw new InfrastructureException(error, 'Database is not ready');
    }
  }
}
