import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginatedResponseDto } from '../../../../common/dto/paginated-response.dto.js';
import {
  ApiErrorResponses,
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from '../../../../common/decorators/index.js';
import { CurrentUserId } from '../../../authentication/presentation/decorators/current-user-id.decorator.js';
import { AccessTokenGuard } from '../../../authentication/presentation/guards/access-token.guard.js';
import { PomodoroHistoryService } from '../../application/services/pomodoro-history.service.js';
import { CreatePomodoroHistoryRequestDto } from '../dto/requests/create-pomodoro-history.request.dto.js';
import { PomodoroHistoryQueryDto } from '../dto/requests/pomodoro-history.query.dto.js';
import { PomodoroHistoryResponseDto } from '../dto/responses/pomodoro-history.response.dto.js';

@ApiTags('Pomodoro')
@ApiBearerAuth('access-token')
@ApiErrorResponses()
@UseGuards(AccessTokenGuard)
@Controller('pomodoro/history')
export class PomodoroHistoryController {
  constructor(private readonly service: PomodoroHistoryService) {}

  @Get()
  @ApiOperation({
    operationId: 'pomodoroHistoryList',
    summary: 'List my Pomodoro phase history',
  })
  @ApiPaginatedResponse(
    PomodoroHistoryResponseDto,
    'Pomodoro history returned.',
  )
  async list(
    @CurrentUserId() userId: string,
    @Query() query: PomodoroHistoryQueryDto,
  ) {
    const filters = {
      ...query,
      dateFrom: query.dateFrom ? new Date(query.dateFrom) : undefined,
      dateTo: query.dateTo ? new Date(query.dateTo) : undefined,
    };
    const result = await this.service.list(userId, filters);
    const items = result.items.map(PomodoroHistoryResponseDto.fromRecord);
    return new PaginatedResponseDto(
      items,
      query.page,
      query.pageSize,
      result.totalItems,
    );
  }

  @Post()
  @ApiOperation({
    operationId: 'pomodoroHistoryCreate',
    summary: 'Record a completed or ended phase',
  })
  @ApiSuccessResponse(PomodoroHistoryResponseDto, 'Pomodoro history recorded.')
  async create(
    @CurrentUserId() userId: string,
    @Body() body: CreatePomodoroHistoryRequestDto,
  ) {
    const input = {
      ...body,
      startedAt: new Date(body.startedAt),
      endedAt: new Date(body.endedAt),
    };
    return PomodoroHistoryResponseDto.fromRecord(
      await this.service.create(userId, input),
    );
  }
}
