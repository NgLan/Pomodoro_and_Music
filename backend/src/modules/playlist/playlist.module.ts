import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from '../authentication/authentication.module.js';
import { MEDIA_ITEM_REPOSITORY } from './application/interfaces/media-item.repository.interface.js';
import { PLAYLIST_ITEM_REPOSITORY } from './application/interfaces/playlist-item.repository.interface.js';
import { PLAYLIST_REPOSITORY } from './application/interfaces/playlist.repository.interface.js';
import { YOUTUBE_MEDIA_PROVIDER } from './application/interfaces/youtube-media.provider.interface.js';
import { PlaylistItemService } from './application/services/playlist-item.service.js';
import { PlaylistService } from './application/services/playlist.service.js';
import { YoutubeVideoService } from './application/services/youtube-video.service.js';
import { MediaItemOrmEntity } from './infrastructure/database/entities/media-item.orm-entity.js';
import { PlaylistItemOrmEntity } from './infrastructure/database/entities/playlist-item.orm-entity.js';
import { PlaylistOrmEntity } from './infrastructure/database/entities/playlist.orm-entity.js';
import { TypeOrmMediaItemRepository } from './infrastructure/database/repositories/typeorm-media-item.repository.js';
import { TypeOrmPlaylistItemRepository } from './infrastructure/database/repositories/typeorm-playlist-item.repository.js';
import { TypeOrmPlaylistRepository } from './infrastructure/database/repositories/typeorm-playlist.repository.js';
import { YoutubeDataApiProvider } from './infrastructure/external/youtube-data-api.provider.js';
import { PlaylistDuplicateController } from './presentation/controllers/playlist-duplicate.controller.js';
import { PlaylistItemController } from './presentation/controllers/playlist-item.controller.js';
import { PlaylistController } from './presentation/controllers/playlist.controller.js';
import { YoutubeVideoController } from './presentation/controllers/youtube-video.controller.js';

@Module({
  imports: [
    AuthenticationModule,
    TypeOrmModule.forFeature([
      PlaylistOrmEntity,
      PlaylistItemOrmEntity,
      MediaItemOrmEntity,
    ]),
  ],
  controllers: [
    PlaylistController,
    PlaylistDuplicateController,
    PlaylistItemController,
    YoutubeVideoController,
  ],
  providers: [
    PlaylistService,
    PlaylistItemService,
    YoutubeVideoService,
    TypeOrmPlaylistRepository,
    TypeOrmPlaylistItemRepository,
    TypeOrmMediaItemRepository,
    YoutubeDataApiProvider,
    { provide: PLAYLIST_REPOSITORY, useExisting: TypeOrmPlaylistRepository },
    {
      provide: PLAYLIST_ITEM_REPOSITORY,
      useExisting: TypeOrmPlaylistItemRepository,
    },
    { provide: MEDIA_ITEM_REPOSITORY, useExisting: TypeOrmMediaItemRepository },
    { provide: YOUTUBE_MEDIA_PROVIDER, useExisting: YoutubeDataApiProvider },
  ],
})
export class PlaylistModule {}
