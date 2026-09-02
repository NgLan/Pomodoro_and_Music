import { registerAs } from '@nestjs/config';
import type { YoutubeConfig } from './config.types.js';

export default registerAs('youtube', (): YoutubeConfig => ({
  apiKey: process.env.YOUTUBE_API_KEY!,
}));
