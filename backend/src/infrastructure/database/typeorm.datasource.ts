import 'dotenv/config';
import { DataSource } from 'typeorm';
import type { DatabaseConfig } from '../../common/config/config.types.js';
import { createDataSourceOptions } from './typeorm-options.js';

const isDev = (process.env.NODE_ENV ?? 'development') === 'development';
const databaseUrl =
  isDev && process.env.LOCAL_DATABASE_URL
    ? process.env.LOCAL_DATABASE_URL
    : process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    isDev
      ? 'Environment variable LOCAL_DATABASE_URL (or DATABASE_URL) is required'
      : 'Environment variable DATABASE_URL is required',
  );
}

const configuration: DatabaseConfig = { url: databaseUrl };

export default new DataSource(createDataSourceOptions(configuration, false));
