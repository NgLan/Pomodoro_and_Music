import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getLiveness(): { status: 'ok' } {
    return { status: 'ok' };
  }

  getReadiness(): {
    status: 'ready';
    checks: { application: 'up' };
  } {
    return {
      status: 'ready',
      checks: { application: 'up' },
    };
  }
}
