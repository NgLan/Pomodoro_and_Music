import type {
  PomodoroConfigurationRequestDto,
  PomodoroConfigurationResponseDto,
} from "@/api";
import type { ConfigurationFormValues } from "../types/pomodoro-ui.types";

export const EMPTY_VALUES: ConfigurationFormValues = {
  focusPlaylistId: null,
  breakPlaylistId: null,
  name: "",
  focusDurationMinutes: 25,
  shortBreakDurationMinutes: 5,
  longBreakDurationMinutes: 15,
  focusSessionsBeforeLongBreak: 4,
};

export function valuesFromConfiguration(
  value: PomodoroConfigurationResponseDto,
) {
  return {
    focusPlaylistId: value.focusPlaylistId,
    breakPlaylistId: value.breakPlaylistId,
    name: value.name,
    focusDurationMinutes: value.focusDurationSeconds / 60,
    shortBreakDurationMinutes: value.shortBreakDurationSeconds / 60,
    longBreakDurationMinutes: value.longBreakDurationSeconds / 60,
    focusSessionsBeforeLongBreak: value.focusSessionsBeforeLongBreak,
  };
}

export function configurationRequest(
  values: ConfigurationFormValues,
): PomodoroConfigurationRequestDto {
  return {
    name: values.name.trim(),
    focusPlaylistId: values.focusPlaylistId,
    breakPlaylistId: values.breakPlaylistId,
    focusDurationSeconds: values.focusDurationMinutes * 60,
    shortBreakDurationSeconds: values.shortBreakDurationMinutes * 60,
    longBreakDurationSeconds: values.longBreakDurationMinutes * 60,
    focusSessionsBeforeLongBreak: values.focusSessionsBeforeLongBreak,
  };
}
