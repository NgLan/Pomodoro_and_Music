import type {
  PlaylistDetailResponseDto,
  PomodoroConfigurationResponseDto,
} from "@/api";

export function playlistFixture(
  id = "focus",
  ids = ["a", "b", "c"],
): PlaylistDetailResponseDto {
  return {
    id,
    name: id,
    description: null,
    thumbnailUrl: null,
    sourceType: "MANUAL",
    sourceUrl: null,
    sourceExternalId: null,
    lastSyncedAt: null,
    createdAt: "",
    updatedAt: "",
    items: ids.map(trackFixture),
  };
}

export const configurationFixture: PomodoroConfigurationResponseDto = {
  id: "configuration",
  name: "Study",
  focusDurationSeconds: 60,
  shortBreakDurationSeconds: 60,
  longBreakDurationSeconds: 60,
  focusSessionsBeforeLongBreak: 2,
  focusPlaylistId: "focus",
  breakPlaylistId: "break",
  isDefault: true,
  createdAt: "",
  updatedAt: "",
};

function trackFixture(id: string, position: number) {
  return {
    id,
    position,
    media: {
      externalMediaId: id,
      title: id,
      channelName: null,
      thumbnailUrl: null,
      durationSeconds: 100,
      sourceUrl: "",
      availability: "AVAILABLE" as const,
    },
  };
}
