import { z } from "zod";

type ValidationKey = "MSG_MINUTE_RANGE" | "MSG_NAME_REQUIRED" | "MSG_ROUND_RANGE";
type Translate = (key: ValidationKey) => string;

export function createConfigurationFormSchema(translate: Translate) {
  return z.object({
    name: z.string().trim().min(1, translate("MSG_NAME_REQUIRED")).max(120),
    focusDurationMinutes: z.number().int().min(1, translate("MSG_MINUTE_RANGE")).max(180),
    shortBreakDurationMinutes: z.number().int().min(1, translate("MSG_MINUTE_RANGE")).max(180),
    longBreakDurationMinutes: z.number().int().min(1, translate("MSG_MINUTE_RANGE")).max(180),
    focusSessionsBeforeLongBreak: z.number().int().min(1, translate("MSG_ROUND_RANGE")).max(12),
  });
}
