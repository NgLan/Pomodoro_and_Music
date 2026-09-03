import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength } from 'class-validator';

export class PomodoroConfigurationRequestDto {
  @ApiProperty({ example: 'Deep work' })
  @IsString() @MinLength(1) @MaxLength(120)
  name!: string;

  @ApiProperty({ example: 1500 })
  @Type(() => Number) @IsInt() @Min(1) @Max(86400)
  focusDurationSeconds!: number;

  @ApiProperty({ example: 300 })
  @Type(() => Number) @IsInt() @Min(1) @Max(86400)
  shortBreakDurationSeconds!: number;

  @ApiProperty({ example: 900 })
  @Type(() => Number) @IsInt() @Min(1) @Max(86400)
  longBreakDurationSeconds!: number;

  @ApiProperty({ example: 4 })
  @Type(() => Number) @IsInt() @Min(1) @Max(100)
  focusSessionsBeforeLongBreak!: number;

  @ApiPropertyOptional({ type: String, format: 'uuid', nullable: true })
  @IsOptional() @IsUUID()
  focusPlaylistId?: string | null;

  @ApiPropertyOptional({ type: String, format: 'uuid', nullable: true })
  @IsOptional() @IsUUID()
  breakPlaylistId?: string | null;
}
