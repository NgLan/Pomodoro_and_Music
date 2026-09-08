import { vi } from "vitest";
import type { YoutubePlayer } from "../types/youtube-player.types";

export function youtubeFixture(): YoutubePlayer {
  return {
    loadVideoById: vi.fn(),
    cueVideoById: vi.fn(),
    playVideo: vi.fn(),
    pauseVideo: vi.fn(),
    stopVideo: vi.fn(),
    getCurrentTime: () => 12,
    getVideoUrl: () => "https://www.youtube.com/watch?v=a",
    setVolume: vi.fn(),
    destroy: vi.fn(),
  };
}
