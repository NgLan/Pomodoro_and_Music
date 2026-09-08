import { z } from "zod";

type ValidationKey =
  "MSG_MINUTE_RANGE" | "MSG_NAME_REQUIRED" | "MSG_ROUND_RANGE";
type Translate = (key: ValidationKey) => string;

export function createConfigurationFormSchema(translate: Translate) {
  const minutes = z
    .number()
    .int()
    .min(1, translate("MSG_MINUTE_RANGE"))
    .max(180);
  return z.object({
    focusPlaylistId: z.string().uuid().nullable(),
    breakPlaylistId: z.string().uuid().nullable(),
    name: z.string().trim().min(1, translate("MSG_NAME_REQUIRED")).max(120),
    focusDurationMinutes: minutes,
    shortBreakDurationMinutes: minutes,
    longBreakDurationMinutes: minutes,
    focusSessionsBeforeLongBreak: z
      .number()
      .int()
      .min(1, translate("MSG_ROUND_RANGE"))
      .max(12),
  });
}
