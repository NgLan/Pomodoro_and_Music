export interface YoutubePlayer {
  loadVideoById(options: { videoId: string; startSeconds: number }): void;
  cueVideoById(options: { videoId: string; startSeconds: number }): void;
  playVideo(): void;
  pauseVideo(): void;
  stopVideo(): void;
  getCurrentTime(): number;
  getVideoUrl(): string;
  setVolume(volume: number): void;
  destroy(): void;
}

export interface YoutubeApi {
  Player: new (
    element: HTMLElement,
    options: {
      width: string;
      height: string;
      playerVars: { origin: string; playsinline: number };
      events: {
        onReady: () => void;
        onStateChange: (event: { data: number; target: YoutubePlayer }) => void;
        onError: (event: { data: number; target: YoutubePlayer }) => void;
        onAutoplayBlocked: () => void;
      };
    },
  ) => YoutubePlayer;
}

declare global {
  interface Window {
    YT?: YoutubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}
