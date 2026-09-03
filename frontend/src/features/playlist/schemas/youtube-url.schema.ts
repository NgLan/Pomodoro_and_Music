import { z } from "zod";

export function createYoutubeUrlSchema(message: string) {
  return z.object({
    url: z
      .string()
      .trim()
      .url(message)
      .refine((value) => {
        try {
          const host = new URL(value).hostname.replace(/^www\./, "");
          return [
            "youtube.com",
            "m.youtube.com",
            "music.youtube.com",
            "youtu.be",
          ].includes(host);
        } catch {
          return false;
        }
      }, message),
  });
}

export type YoutubeUrlValues = z.infer<
  ReturnType<typeof createYoutubeUrlSchema>
>;
