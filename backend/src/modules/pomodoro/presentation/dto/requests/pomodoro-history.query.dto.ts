import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../../../../common/dto/pagination-query.dto.js';
import { PomodoroHistoryStatus } from '../../../domain/enums/pomodoro-history-status.enum.js';

export class PomodoroHistoryQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  configurationId?: string;

  @ApiPropertyOptional({ enum: PomodoroHistoryStatus })
  @IsOptional()
  @IsEnum(PomodoroHistoryStatus)
  status?: PomodoroHistoryStatus;

  @ApiPropertyOptional({ format: 'date-time' })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({ format: 'date-time' })
  @IsOptional()
  @IsDateString()
  dateTo?: string;
}
