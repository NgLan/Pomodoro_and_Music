import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from '../authentication/authentication.module.js';
import { POMODORO_CONFIGURATION_REPOSITORY } from './application/interfaces/pomodoro-configuration.repository.interface.js';
import { POMODORO_HISTORY_REPOSITORY } from './application/interfaces/pomodoro-history.repository.interface.js';
import { PomodoroConfigurationService } from './application/services/pomodoro-configuration.service.js';
import { PomodoroHistoryService } from './application/services/pomodoro-history.service.js';
import { PomodoroHistoryOrmEntity } from './infrastructure/database/entities/pomodoro-history.orm-entity.js';
import { PomodoroOrmEntity } from './infrastructure/database/entities/pomodoro.orm-entity.js';
import { TypeOrmPomodoroConfigurationRepository } from './infrastructure/database/repositories/typeorm-pomodoro-configuration.repository.js';
import { TypeOrmPomodoroHistoryRepository } from './infrastructure/database/repositories/typeorm-pomodoro-history.repository.js';
import { PomodoroConfigurationController } from './presentation/controllers/pomodoro-configuration.controller.js';
import { PomodoroHistoryController } from './presentation/controllers/pomodoro-history.controller.js';

@Module({
  imports: [
    AuthenticationModule,
    TypeOrmModule.forFeature([PomodoroOrmEntity, PomodoroHistoryOrmEntity]),
  ],
  controllers: [PomodoroConfigurationController, PomodoroHistoryController],
  providers: [
    PomodoroConfigurationService,
    PomodoroHistoryService,
    TypeOrmPomodoroConfigurationRepository,
    TypeOrmPomodoroHistoryRepository,
    { provide: POMODORO_CONFIGURATION_REPOSITORY, useExisting: TypeOrmPomodoroConfigurationRepository },
    { provide: POMODORO_HISTORY_REPOSITORY, useExisting: TypeOrmPomodoroHistoryRepository },
  ],
})
export class PomodoroModule {}
