import { ApiProperty } from '@nestjs/swagger';

export class DeletePlaylistResponseDto {
  @ApiProperty({ example: true }) deleted!: boolean;
}
