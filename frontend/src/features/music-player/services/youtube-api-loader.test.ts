import { afterEach, expect, it, vi } from "vitest";

afterEach(() => {
  vi.useRealTimers();
  delete window.YT;
  delete window.onYouTubeIframeAPIReady;
  document
    .querySelectorAll('script[src="https://www.youtube.com/iframe_api"]')
    .forEach((script) => script.remove());
});

it("shares one loader and allows retry after a script network error", async () => {
  vi.resetModules();
  const { loadYoutubeApi } = await import("./youtube-api-loader");
  const first = loadYoutubeApi();
  const rejection = expect(first).rejects.toThrow();
  expect(loadYoutubeApi()).toBe(first);
  document
    .querySelector('script[src="https://www.youtube.com/iframe_api"]')!
    .dispatchEvent(new Event("error"));
  await rejection;
  const retry = loadYoutubeApi();
  expect(retry).not.toBe(first);
  window.YT = { Player: vi.fn() };
  window.onYouTubeIframeAPIReady!();
  await expect(retry).resolves.toBe(window.YT);
});

it("bounds provider loading time instead of waiting forever", async () => {
  vi.resetModules();
  vi.useFakeTimers();
  const { loadYoutubeApi } = await import("./youtube-api-loader");
  const loading = loadYoutubeApi();
  const rejection = expect(loading).rejects.toThrow();
  await vi.advanceTimersByTimeAsync(15000);
  await rejection;
  expect(
    document.querySelector('script[src="https://www.youtube.com/iframe_api"]'),
  ).toBeNull();
});
