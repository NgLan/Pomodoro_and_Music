import { NestFactory } from '@nestjs/core';
import type { ConfigType } from '@nestjs/config';
import { AppModule } from './app.module.js';
import { appConfig } from './common/config/index.js';
import { AppLoggerService } from './common/logging/app-logger.service.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const configuration = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);
  const logger = app.get(AppLoggerService);

  app.useLogger(logger);
  app.enableCors({
    origin: configuration.frontendOrigin,
    credentials: true,
  });
  app.enableShutdownHooks();

  await app.listen(configuration.port);
  logger.log({
    event: 'application_started',
    operation: 'bootstrap',
    port: configuration.port,
    environment: configuration.nodeEnv,
  });
}
await bootstrap();
