import { z } from "zod";

export const playlistUrlSchema = z
  .string()
  .trim()
  .url()
  .refine((value) => {
    let url: URL;
    try {
      url = new URL(value);
    } catch {
      return false;
    }
    return (
      ["https:", "http:"].includes(url.protocol) &&
      [
        "youtube.com",
        "www.youtube.com",
        "m.youtube.com",
        "music.youtube.com",
      ].includes(url.hostname) &&
      ["/playlist", "/watch"].includes(url.pathname) &&
      !url.username &&
      !url.password &&
      /^[\w-]{2,255}$/.test(url.searchParams.get("list") ?? "")
    );
  });
