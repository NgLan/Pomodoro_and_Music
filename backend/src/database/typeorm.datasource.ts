import 'dotenv/config';
import { DataSource } from 'typeorm';
import type { DatabaseConfig } from '../common/config/config.types.js';
import { ensureDatabaseExists } from './database-initializer.js';
import { createDataSourceOptions } from './typeorm-options.js';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('Environment variable DATABASE_URL is required');
}

const configuration: DatabaseConfig = { url: databaseUrl };
await ensureDatabaseExists(configuration.url);

export default new DataSource(createDataSourceOptions(configuration, false));
