import type { StorageKey } from "./storage-keys";

interface StorageCodec<T> {
  parse(value: unknown): T;
}

function getBrowserStorage(): Storage | undefined {
  return typeof window === "undefined" ? undefined : window.localStorage;
}

/** Reads versionable JSON from browser storage and safely rejects corrupt data. */
export function readStorageValue<T>(
  key: StorageKey,
  codec: StorageCodec<T>,
): T | undefined {
  const serializedValue = getBrowserStorage()?.getItem(key);
  if (serializedValue === null || serializedValue === undefined) {
    return undefined;
  }

  try {
    return codec.parse(JSON.parse(serializedValue));
  } catch {
    return undefined;
  }
}

export function writeStorageValue<T>(key: StorageKey, value: T): void {
  getBrowserStorage()?.setItem(key, JSON.stringify(value));
}

export function removeStorageValue(key: StorageKey): void {
  getBrowserStorage()?.removeItem(key);
}
