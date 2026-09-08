import { registerAs } from '@nestjs/config';
import type { DatabaseConfig } from './config.types.js';

export default registerAs('database', (): DatabaseConfig => {
  const isDev = process.env.NODE_ENV === 'development';
  const url =
    isDev && process.env.LOCAL_DATABASE_URL
      ? process.env.LOCAL_DATABASE_URL
      : process.env.DATABASE_URL!;
  return { url };
});
