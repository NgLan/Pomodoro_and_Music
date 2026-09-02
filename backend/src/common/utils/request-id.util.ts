import { randomUUID } from 'node:crypto';
import { MAX_REQUEST_ID_LENGTH } from '../constants/headers.constants.js';

const REQUEST_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]*$/;

export function isValidRequestId(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length <= MAX_REQUEST_ID_LENGTH &&
    REQUEST_ID_PATTERN.test(value)
  );
}

export function resolveRequestId(value: unknown): string {
  return isValidRequestId(value) ? value : randomUUID();
}
