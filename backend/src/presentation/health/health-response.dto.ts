import { ApiProperty } from '@nestjs/swagger';

export class LivenessResponseDto {
  @ApiProperty({ example: 'ok' })
  status: 'ok';
}

export class ReadinessChecksDto {
  @ApiProperty({ example: 'up' })
  application: 'up';

  @ApiProperty({ example: 'up' })
  database: 'up';
}

export class ReadinessResponseDto {
  @ApiProperty({ example: 'ready' })
  status: 'ready';

  @ApiProperty({ type: ReadinessChecksDto })
  checks: ReadinessChecksDto;
}
