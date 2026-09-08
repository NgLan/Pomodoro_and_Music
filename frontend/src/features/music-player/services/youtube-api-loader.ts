import type { YoutubeApi } from "../types/youtube-player.types";

let pending: Promise<YoutubeApi> | null = null;

export function loadYoutubeApi(): Promise<YoutubeApi> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  pending ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const previous = window.onYouTubeIframeAPIReady;
    const timeout = window.setTimeout(() => fail(), 15000);
    const fail = () => {
      window.clearTimeout(timeout);
      script.remove();
      pending = null;
      window.onYouTubeIframeAPIReady = previous;
      reject(new Error("YouTube player could not load"));
    };
    window.onYouTubeIframeAPIReady = () => {
      window.clearTimeout(timeout);
      previous?.();
      if (window.YT?.Player) resolve(window.YT);
      else fail();
    };
    script.src = "https://www.youtube.com/iframe_api";
    script.onerror = fail;
    document.head.append(script);
  });
  return pending;
}
