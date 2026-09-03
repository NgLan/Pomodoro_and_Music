import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class ResolveYoutubeVideoRequestDto {
  @ApiProperty({ example: 'https://www.youtube.com/watch?v=jfKfPfyJRdk' })
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  url!: string;
}
