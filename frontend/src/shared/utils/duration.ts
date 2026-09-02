/** Formats a non-negative duration as MM:SS or HH:MM:SS. */
export function formatDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
    throw new RangeError("Duration must be a non-negative finite number");
  }

  const roundedSeconds = Math.floor(totalSeconds);
  const hours = Math.floor(roundedSeconds / 3_600);
  const minutes = Math.floor((roundedSeconds % 3_600) / 60);
  const seconds = roundedSeconds % 60;
  const clockParts = [minutes, seconds].map((part) =>
    part.toString().padStart(2, "0"),
  );

  return hours > 0
    ? [hours.toString().padStart(2, "0"), ...clockParts].join(":")
    : clockParts.join(":");
}
