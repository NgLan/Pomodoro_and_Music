import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiErrorResponses, ApiListResponse, ApiSuccessResponse } from '../../../../common/decorators/index.js';
import { CurrentUserId } from '../../../authentication/presentation/decorators/current-user-id.decorator.js';
import { AccessTokenGuard } from '../../../authentication/presentation/guards/access-token.guard.js';
import { PomodoroConfigurationService } from '../../application/services/pomodoro-configuration.service.js';
import { PomodoroConfigurationRequestDto } from '../dto/requests/pomodoro-configuration.request.dto.js';
import { DeletePomodoroResponseDto } from '../dto/responses/delete-pomodoro.response.dto.js';
import { PomodoroConfigurationResponseDto } from '../dto/responses/pomodoro-configuration.response.dto.js';

@ApiTags('Pomodoro')
@ApiBearerAuth('access-token')
@ApiErrorResponses()
@UseGuards(AccessTokenGuard)
@Controller('pomodoro')
export class PomodoroConfigurationController {
  constructor(private readonly service: PomodoroConfigurationService) {}

  @Post()
  @ApiOperation({ operationId: 'pomodoroCreate', summary: 'Create a Pomodoro configuration' })
  @ApiSuccessResponse(PomodoroConfigurationResponseDto, 'Pomodoro configuration created.')
  async create(@CurrentUserId() userId: string, @Body() body: PomodoroConfigurationRequestDto) {
    return PomodoroConfigurationResponseDto.fromDomain(await this.service.create(userId, body));
  }

  @Get()
  @ApiOperation({ operationId: 'pomodoroList', summary: 'List my Pomodoro configurations' })
  @ApiListResponse(PomodoroConfigurationResponseDto, 'Pomodoro configurations returned.')
  async list(@CurrentUserId() userId: string) {
    const values = await this.service.list(userId);
    return values.map(PomodoroConfigurationResponseDto.fromDomain);
  }

  @Get(':id')
  @ApiOperation({ operationId: 'pomodoroGet', summary: 'Get one Pomodoro configuration' })
  @ApiSuccessResponse(PomodoroConfigurationResponseDto, 'Pomodoro configuration returned.')
  async get(@CurrentUserId() userId: string, @Param('id', ParseUUIDPipe) id: string) {
    return PomodoroConfigurationResponseDto.fromDomain(await this.service.get(userId, id));
  }

  @Put(':id')
  @ApiOperation({ operationId: 'pomodoroUpdate', summary: 'Update a Pomodoro configuration' })
  @ApiSuccessResponse(PomodoroConfigurationResponseDto, 'Pomodoro configuration updated.')
  async update(@CurrentUserId() userId: string, @Param('id', ParseUUIDPipe) id: string, @Body() body: PomodoroConfigurationRequestDto) {
    return PomodoroConfigurationResponseDto.fromDomain(await this.service.update(userId, id, body));
  }

  @Delete(':id')
  @ApiOperation({ operationId: 'pomodoroDelete', summary: 'Delete configuration without deleting history' })
  @ApiSuccessResponse(DeletePomodoroResponseDto, 'Pomodoro configuration deleted.')
  async delete(@CurrentUserId() userId: string, @Param('id', ParseUUIDPipe) id: string) {
    await this.service.delete(userId, id);
    return { deleted: true };
  }
}
