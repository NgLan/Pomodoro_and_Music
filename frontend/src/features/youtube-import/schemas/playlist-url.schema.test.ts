import { describe, expect, it } from "vitest";
import { playlistUrlSchema } from "./playlist-url.schema";

describe("playlist URL validation", () => {
  it.each([
    "https://www.youtube.com/playlist?list=PLtest",
    "https://music.youtube.com/watch?v=abcdef&list=PLtest",
  ])("accepts %s", (url) => {
    expect(playlistUrlSchema.safeParse(url).success).toBe(true);
  });
  it.each([
    "https://youtube.com/watch?v=abcdef",
    "https://youtube.com.evil.test/playlist?list=PLtest",
    "ftp://youtube.com/playlist?list=PLtest",
    "invalid",
  ])("rejects %s", (url) => {
    expect(playlistUrlSchema.safeParse(url).success).toBe(false);
  });
});
