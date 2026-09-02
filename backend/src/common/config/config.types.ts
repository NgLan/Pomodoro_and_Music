export const NODE_ENVIRONMENTS = ['development', 'test', 'production'] as const;
export const LOG_LEVELS = [
  'error',
  'warn',
  'info',
  'debug',
  'verbose',
] as const;

export type NodeEnvironment = (typeof NODE_ENVIRONMENTS)[number];
export type AppLogLevel = (typeof LOG_LEVELS)[number];

export interface AppConfig {
  nodeEnv: NodeEnvironment;
  port: number;
  frontendOrigin: string;
  logLevel: AppLogLevel;
}

export interface DatabaseConfig {
  url: string;
}

export interface AuthConfig {
  jwtAccessSecret: string;
  jwtAccessTtl: string;
  refreshTokenTtl: string;
}

export interface YoutubeConfig {
  apiKey: string;
}
