import { DEFAULT_NODE_ENV, DEFAULT_PORT } from '../constants/app.constants.js';
import {
  LOG_LEVELS,
  NODE_ENVIRONMENTS,
  type AppLogLevel,
  type NodeEnvironment,
} from './config.types.js';

const DEFAULT_LOG_LEVEL: AppLogLevel = 'info';
const MIN_SECRET_LENGTH = 32;
const DURATION_PATTERN = /^[1-9]\d*(?:ms|s|m|h|d|w)$/;

type Environment = Record<string, unknown>;

function readRequiredString(environment: Environment, key: string): string {
  const value = environment[key];
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value.trim();
}

function validateUrl(value: string, key: string, protocols: string[]): string {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(value);
  } catch {
    throw new Error(`Environment variable ${key} must be a valid URL`);
  }

  if (!protocols.includes(parsedUrl.protocol)) {
    throw new Error(
      `Environment variable ${key} must use ${protocols.join(' or ')}`,
    );
  }
  return value;
}

/** Validates and normalizes environment variables before Nest starts. */
export function validateEnvironment(environment: Environment): Environment {
  const nodeEnv = (environment.NODE_ENV ?? DEFAULT_NODE_ENV) as string;
  if (!NODE_ENVIRONMENTS.includes(nodeEnv as NodeEnvironment)) {
    throw new Error(
      `Environment variable NODE_ENV must be one of: ${NODE_ENVIRONMENTS.join(', ')}`,
    );
  }

  const port = Number(environment.PORT ?? DEFAULT_PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error(
      'Environment variable PORT must be an integer from 1 to 65535',
    );
  }

  const logLevel = (environment.LOG_LEVEL ?? DEFAULT_LOG_LEVEL) as string;
  if (!LOG_LEVELS.includes(logLevel as AppLogLevel)) {
    throw new Error(
      `Environment variable LOG_LEVEL must be one of: ${LOG_LEVELS.join(', ')}`,
    );
  }

  const databaseUrl = validateUrl(
    readRequiredString(environment, 'DATABASE_URL'),
    'DATABASE_URL',
    ['postgres:', 'postgresql:'],
  );
  const frontendOrigin = validateUrl(
    readRequiredString(environment, 'FRONTEND_ORIGIN'),
    'FRONTEND_ORIGIN',
    ['http:', 'https:'],
  );
  const jwtAccessSecret = readRequiredString(environment, 'JWT_ACCESS_SECRET');
  if (jwtAccessSecret.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `Environment variable JWT_ACCESS_SECRET must contain at least ${MIN_SECRET_LENGTH} characters`,
    );
  }

  const jwtAccessTtl = readRequiredString(environment, 'JWT_ACCESS_TTL');
  const refreshTokenTtl = readRequiredString(environment, 'REFRESH_TOKEN_TTL');
  for (const [key, value] of [
    ['JWT_ACCESS_TTL', jwtAccessTtl],
    ['REFRESH_TOKEN_TTL', refreshTokenTtl],
  ] as const) {
    if (!DURATION_PATTERN.test(value)) {
      throw new Error(
        `Environment variable ${key} must be a positive duration such as 15m or 7d`,
      );
    }
  }

  const youtubeApiKey = readRequiredString(environment, 'YOUTUBE_API_KEY');

  return {
    ...environment,
    NODE_ENV: nodeEnv,
    PORT: port,
    DATABASE_URL: databaseUrl,
    JWT_ACCESS_SECRET: jwtAccessSecret,
    JWT_ACCESS_TTL: jwtAccessTtl,
    REFRESH_TOKEN_TTL: refreshTokenTtl,
    YOUTUBE_API_KEY: youtubeApiKey,
    FRONTEND_ORIGIN: frontendOrigin,
    LOG_LEVEL: logLevel,
  };
}
