import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiErrorResponses,
  ApiSuccessResponse,
} from '../common/decorators/index.js';
import {
  LivenessResponseDto,
  ReadinessResponseDto,
} from './health-response.dto.js';
import { HealthService } from './health.service.js';

@ApiTags('Health')
@ApiErrorResponses()
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('live')
  @ApiOperation({
    operationId: 'healthLiveness',
    summary: 'Check whether the process is alive',
  })
  @ApiSuccessResponse(LivenessResponseDto, 'The application process is alive.')
  getLiveness(): LivenessResponseDto {
    return this.healthService.getLiveness();
  }

  @Get('ready')
  @ApiOperation({
    operationId: 'healthReadiness',
    summary: 'Check whether the application can serve traffic',
  })
  @ApiSuccessResponse(
    ReadinessResponseDto,
    'The application and database are ready.',
  )
  getReadiness(): Promise<ReadinessResponseDto> {
    return this.healthService.getReadiness();
  }
}
