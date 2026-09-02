import {
  Inject,
  Injectable,
  ConsoleLogger,
  type LogLevel,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { appConfig } from '../config/index.js';
import { RequestContextStorage } from '../middleware/request-context.storage.js';
import { redactSensitiveData } from './sensitive-data-redactor.js';

const LEVELS_BY_MINIMUM: Record<string, LogLevel[]> = {
  error: ['fatal', 'error'],
  warn: ['fatal', 'error', 'warn'],
  info: ['fatal', 'error', 'warn', 'log'],
  debug: ['fatal', 'error', 'warn', 'log', 'debug'],
  verbose: ['fatal', 'error', 'warn', 'log', 'debug', 'verbose'],
};

@Injectable()
export class AppLoggerService {
  private readonly logger: ConsoleLogger;

  constructor(
    @Inject(appConfig.KEY) configuration: ConfigType<typeof appConfig>,
    private readonly contextStorage: RequestContextStorage,
  ) {
    this.logger = new ConsoleLogger({
      json: configuration.nodeEnv === 'production',
      logLevels: LEVELS_BY_MINIMUM[configuration.logLevel],
      structuredParams: true,
      flattenParams: true,
    });
  }

  log(message: unknown, ...optionalParams: unknown[]): void {
    this.logger.log(this.enrich(message, optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    this.logger.error(this.enrich(message, optionalParams));
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    this.logger.warn(this.enrich(message, optionalParams));
  }

  debug(message: unknown, ...optionalParams: unknown[]): void {
    this.logger.debug(this.enrich(message, optionalParams));
  }

  verbose(message: unknown, ...optionalParams: unknown[]): void {
    this.logger.verbose(this.enrich(message, optionalParams));
  }

  fatal(message: unknown, ...optionalParams: unknown[]): void {
    this.logger.fatal(this.enrich(message, optionalParams));
  }

  private enrich(message: unknown, optionalParams: unknown[]): object {
    const context = this.contextStorage.get();
    const redactedMessage = redactSensitiveData(message);

    return {
      ...(typeof redactedMessage === 'object' && redactedMessage !== null
        ? redactedMessage
        : { message: redactedMessage }),
      ...(optionalParams.length > 0
        ? { params: redactSensitiveData(optionalParams) }
        : {}),
      ...(context
        ? {
            request_id: context.requestId,
            correlation_id: context.correlationId,
            ...(context.userId ? { user_id: context.userId } : {}),
          }
        : {}),
    };
  }
}
