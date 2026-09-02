const DEFAULT_DATE_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  dateStyle: "medium",
  timeStyle: "short",
};

/** Parses an ISO date-time contract and rejects invalid values. */
export function parseIsoDateTime(value: string): Date {
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new RangeError("Invalid ISO date-time value");
  }
  return parsedDate;
}

/** Formats a date-time with the active application locale. */
export function formatDateTime(
  value: Date | string,
  locale: string,
  options: Intl.DateTimeFormatOptions = DEFAULT_DATE_TIME_OPTIONS,
): string {
  const date = typeof value === "string" ? parseIsoDateTime(value) : value;
  return new Intl.DateTimeFormat(locale, options).format(date);
}
