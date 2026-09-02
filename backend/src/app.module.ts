import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CommonModule } from './common/common.module.js';
import {
  appConfig,
  authConfig,
  databaseConfig,
  validateEnvironment,
  youtubeConfig,
} from './common/config/index.js';
import { DatabaseModule } from './infrastructure/database/database.module.js';
import { HealthModule } from './presentation/health/health.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig, databaseConfig, authConfig, youtubeConfig],
      validate: validateEnvironment,
    }),
    CommonModule,
    DatabaseModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
