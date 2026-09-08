export interface YoutubePlaylistItem {
  id?: string;
  snippet?: {
    title?: string;
    description?: string;
    resourceId?: { videoId?: string };
    thumbnails?: Record<string, { url?: string }>;
  };
  contentDetails?: { itemCount?: number };
}

export interface YoutubePlaylistPage {
  items: YoutubePlaylistItem[];
  nextPageToken?: string;
}
