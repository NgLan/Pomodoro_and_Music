import { Global, Module } from '@nestjs/common';
import { RequestContextStorage } from '../middleware/request-context.storage.js';
import { AppLoggerService } from './app-logger.service.js';

@Global()
@Module({
  providers: [RequestContextStorage, AppLoggerService],
  exports: [RequestContextStorage, AppLoggerService],
})
export class LoggerModule {}
