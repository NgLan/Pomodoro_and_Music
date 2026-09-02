import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service.js';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('live')
  getLiveness(): { status: 'ok' } {
    return this.healthService.getLiveness();
  }

  @Get('ready')
  getReadiness(): {
    status: 'ready';
    checks: { application: 'up' };
  } {
    return this.healthService.getReadiness();
  }
}
