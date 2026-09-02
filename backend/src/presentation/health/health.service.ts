import { Injectable } from '@nestjs/common';
import { DatabaseReadinessService } from '../../infrastructure/database/database-readiness.service.js';
import type {
  LivenessResponseDto,
  ReadinessResponseDto,
} from './health-response.dto.js';

@Injectable()
export class HealthService {
  constructor(private readonly databaseReadiness: DatabaseReadinessService) {}

  getLiveness(): LivenessResponseDto {
    return { status: 'ok' };
  }

  async getReadiness(): Promise<ReadinessResponseDto> {
    await this.databaseReadiness.assertReady();
    return {
      status: 'ready',
      checks: {
        application: 'up',
        database: 'up',
      },
    };
  }
}
