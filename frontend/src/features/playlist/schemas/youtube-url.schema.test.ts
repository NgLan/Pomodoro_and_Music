import { describe, expect, it } from "vitest";
import { createYoutubeUrlSchema } from "./youtube-url.schema";

const schema = createYoutubeUrlSchema("invalid");

describe("YouTube URL form schema", () => {
  it.each([
    "https://www.youtube.com/watch?v=jfKfPfyJRdk",
    "https://youtu.be/jfKfPfyJRdk",
  ])("accepts %s", (url) => {
    expect(schema.safeParse({ url }).success).toBe(true);
  });

  it.each(["not-a-url", "https://example.com/watch?v=jfKfPfyJRdk"])(
    "rejects %s",
    (url) => {
      expect(schema.safeParse({ url }).success).toBe(false);
    },
  );
});
