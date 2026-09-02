import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ example: 'success' })
  readonly status = 'success';

  @ApiProperty({ example: 200 })
  readonly code: number;

  @ApiProperty({ example: 'Success' })
  readonly message: string;

  @ApiProperty()
  readonly data: T;

  constructor(code: number, message: string, data: T) {
    this.code = code;
    this.message = message;
    this.data = data;
  }
}
