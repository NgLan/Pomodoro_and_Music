interface YoutubeThumbnail {
  url?: string;
}
interface YoutubeSnippet {
  title?: string;
  channelTitle?: string;
  thumbnails?: Record<string, YoutubeThumbnail>;
}

export interface YoutubeSearchItem {
  id?: { videoId?: string };
  snippet?: YoutubeSnippet;
}

export interface YoutubeVideoItem {
  id?: string;
  snippet?: YoutubeSnippet;
  contentDetails?: { duration?: string };
  status?: { privacyStatus?: string; uploadStatus?: string };
}

export interface YoutubeListResponse<T> {
  items?: T[];
}
