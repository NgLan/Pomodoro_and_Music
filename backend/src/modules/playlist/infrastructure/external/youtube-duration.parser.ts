const ISO_DURATION_PATTERN =
  /^P(?:([\d.]+)D)?T?(?:([\d.]+)H)?(?:([\d.]+)M)?(?:([\d.]+)S)?$/;

export function parseYoutubeDuration(value?: string): number | null {
  if (!value) return null;
  const match = ISO_DURATION_PATTERN.exec(value);
  if (!match) return null;
  const [, days = '0', hours = '0', minutes = '0', seconds = '0'] = match;
  return Math.floor(
    Number(days) * 86400 +
      Number(hours) * 3600 +
      Number(minutes) * 60 +
      Number(seconds),
  );
}
