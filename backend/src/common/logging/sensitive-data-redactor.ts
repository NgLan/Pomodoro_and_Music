const REDACTED_VALUE = '[REDACTED]';
const SENSITIVE_KEYS = new Set([
  'password',
  'passwordhash',
  'accesstoken',
  'refreshtoken',
  'authorization',
  'apikey',
  'secret',
  'clientsecret',
]);

function normalizeKey(key: string): string {
  return key.replaceAll(/[^a-zA-Z0-9]/g, '').toLowerCase();
}

function isSensitiveKey(key: string): boolean {
  const normalizedKey = normalizeKey(key);
  return (
    SENSITIVE_KEYS.has(normalizedKey) ||
    normalizedKey.endsWith('password') ||
    normalizedKey.endsWith('secret') ||
    normalizedKey.endsWith('token') ||
    normalizedKey.endsWith('apikey')
  );
}

function redactValue(value: unknown, seen: WeakSet<object>): unknown {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
      cause: redactValue(value.cause, seen),
    };
  }
  if (value instanceof Date || value === null || typeof value !== 'object') {
    return value;
  }
  if (seen.has(value)) {
    return '[Circular]';
  }
  seen.add(value);

  if (Array.isArray(value)) {
    return value.map((item) => redactValue(item, seen));
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [
      key,
      isSensitiveKey(key) ? REDACTED_VALUE : redactValue(nestedValue, seen),
    ]),
  );
}

/** Returns a redacted copy without mutating the value supplied by the caller. */
export function redactSensitiveData(value: unknown): unknown {
  return redactValue(value, new WeakSet());
}
