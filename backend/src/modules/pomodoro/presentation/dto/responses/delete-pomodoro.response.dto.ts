import { ApiProperty } from '@nestjs/swagger';

export class DeletePomodoroResponseDto {
  @ApiProperty({ example: true }) deleted!: boolean;
}
