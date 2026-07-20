import { PersistentCollection } from './persistent';
import type { Setting } from './models';

const collection = new PersistentCollection('settings');
const cache = new Map<string, unknown>();
const pendingWrites = new Map<string, Promise<void>>();

export function readJsonState<T>(key: string, fallback: T): T {
  return (cache.get(key) as T | undefined) ?? fallback;
}

export async function hydrateJsonState<T>(key: string, fallback: T): Promise<T> {
  try {
    await (pendingWrites.get(key) ?? Promise.resolve());
    const settings = await collection.load();
    const record = settings.find((item) => item.key === key);
    const value = record?.value as T | undefined;
    cache.set(key, value ?? fallback);
    return value ?? fallback;
  } catch {
    cache.set(key, fallback);
    return fallback;
  }
}

export function writeJsonState<T>(key: string, value: T): void {
  cache.set(key, value);
  const write = (pendingWrites.get(key) ?? Promise.resolve()).then(async () => {
    const settings = await collection.load();
    const existing = settings.find((item) => item.key === key);
    const now = Date.now();
    const record: Setting = { id: existing?.id ?? crypto.randomUUID(), key, value, created_at: existing?.created_at ?? now, updated_at: now, deleted_at: null, synced_at: null };
    if (existing) await collection.update(record);
    else await collection.create(record);
  }).catch(() => undefined);
  pendingWrites.set(key, write);
}

export function clearJsonState(key: string): void {
  cache.set(key, []);
  writeJsonState(key, []);
}
