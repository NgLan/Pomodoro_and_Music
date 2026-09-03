import { z } from "zod";

type ValidationKey =
  | "MSG_NAME_REQUIRED"
  | "MSG_NAME_TOO_LONG"
  | "MSG_DESCRIPTION_TOO_LONG"
  | "MSG_THUMBNAIL_INVALID";
type Translate = (key: ValidationKey) => string;

export function createPlaylistFormSchema(translate: Translate) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, translate("MSG_NAME_REQUIRED"))
      .max(255, translate("MSG_NAME_TOO_LONG")),
    description: z
      .string()
      .trim()
      .max(1000, translate("MSG_DESCRIPTION_TOO_LONG")),
    thumbnailUrl: z.union([
      z.literal(""),
      z
        .string()
        .url(translate("MSG_THUMBNAIL_INVALID"))
        .refine(
          (value) => /^https?:\/\//.test(value),
          translate("MSG_THUMBNAIL_INVALID"),
        ),
    ]),
  });
}

export type PlaylistFormValues = z.infer<
  ReturnType<typeof createPlaylistFormSchema>
>;
