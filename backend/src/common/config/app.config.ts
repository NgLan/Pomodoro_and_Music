import { registerAs } from '@nestjs/config';
import { DEFAULT_NODE_ENV, DEFAULT_PORT } from '../constants/app.constants.js';
import type {
  AppConfig,
  AppLogLevel,
  NodeEnvironment,
} from './config.types.js';

export default registerAs('app', (): AppConfig => ({
  nodeEnv: (process.env.NODE_ENV ?? DEFAULT_NODE_ENV) as NodeEnvironment,
  port: Number(process.env.PORT ?? DEFAULT_PORT),
  frontendOrigin: process.env.FRONTEND_ORIGIN!,
  logLevel: (process.env.LOG_LEVEL ?? 'info') as AppLogLevel,
}));
