import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiErrorDetailDto {
  @ApiPropertyOptional({ example: 'name' })
  field?: string;

  @ApiProperty({ example: 'Name is required' })
  message: string;
}

export class ApiErrorResponseDto {
  @ApiProperty({ example: 400 })
  code: number;

  @ApiProperty({ example: 'Invalid request' })
  message: string;

  @ApiProperty({ example: 'INVALID_INPUT' })
  error_code: string;

  @ApiProperty({ type: [ApiErrorDetailDto] })
  details: ApiErrorDetailDto[];

  @ApiProperty({ example: '0198bb70-92ac-77c8-b22f-892d2d97f599' })
  request_id: string;
}
