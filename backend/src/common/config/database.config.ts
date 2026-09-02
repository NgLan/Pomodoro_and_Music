import { registerAs } from '@nestjs/config';
import type { DatabaseConfig } from './config.types.js';

export default registerAs('database', (): DatabaseConfig => ({
  url: process.env.DATABASE_URL!,
}));
