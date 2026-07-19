import { writable, type Writable } from 'svelte/store';
import type { CryptoProvider } from './crypto';
import type { Metadata, RecordByStore, StoreName } from './models';

export const DB_NAME = 'kenzie-dashboard';
export const DB_VERSION = 2;
export const TRASH_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;
export const STORE_NAMES: StoreName[] = ['projects', 'notes', 'tasks', 'documents', 'time_logs', 'launchpad_links', 'events', 'settings'];

const encryptedFields: Partial<Record<StoreName, string[]>> = {
  notes: ['content'], documents: ['content'], tasks: ['notes'],
};

export const dbStatus = writable<'closed' | 'opening' | 'ready' | 'unavailable'>('closed');
const openConnections = new Set<IDBDatabase>();

function upgrade(db: IDBDatabase, oldVersion: number): void {
  if (oldVersion < 1) {
    for (const name of STORE_NAMES.filter((name) => name !== 'events')) {
      const store = db.createObjectStore(name, { keyPath: 'id' });
      store.createIndex('by_updated_at', 'updated_at');
      store.createIndex('by_deleted_at', 'deleted_at');
      if (name !== 'settings') store.createIndex('by_project_id', 'project_id');
      if (name === 'settings') store.createIndex('by_key', 'key', { unique: true });
    }
  }
  if (oldVersion < 2) {
    const store = db.createObjectStore('events', { keyPath: 'id' });
    store.createIndex('by_updated_at', 'updated_at');
    store.createIndex('by_deleted_at', 'deleted_at');
    store.createIndex('by_project_id', 'project_id');
  }
}

export function openDatabase(): Promise<IDBDatabase> {
  if (typeof indexedDB === 'undefined') { dbStatus.set('unavailable'); return Promise.reject(new Error('IndexedDB is unavailable')); }
  dbStatus.set('opening');
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => upgrade(request.result, (event as IDBVersionChangeEvent).oldVersion);
    request.onsuccess = () => { dbStatus.set('ready'); openConnections.add(request.result); resolve(request.result); };
    request.onerror = () => { dbStatus.set('unavailable'); reject(request.error ?? new Error('Unable to open database')); };
  });
}

export function resetDatabase(): Promise<void> {
  for (const db of openConnections) db.close();
  openConnections.clear();
  return new Promise((resolve, reject) => { const request = indexedDB.deleteDatabase(DB_NAME); request.onsuccess = () => resolve(); request.onerror = () => reject(request.error); request.onblocked = () => reject(new Error('Database reset was blocked by an open connection')); });
}

function assertStore(name: string): asserts name is StoreName { if (!STORE_NAMES.includes(name as StoreName)) throw new Error(`Unknown store: ${name}`); }
function assertId(id: unknown): asserts id is string { if (typeof id !== 'string' || id.trim() === '') throw new Error('A non-empty string id is required'); }
function metadata<T extends object>(input: T, now: number, existing?: Metadata): T & Metadata {
  const value = input as T & Partial<Metadata>;
  return { ...value, id: value.id, created_at: existing?.created_at ?? value.created_at ?? now, updated_at: now, deleted_at: value.deleted_at !== undefined ? value.deleted_at : existing?.deleted_at ?? null, synced_at: value.synced_at !== undefined ? value.synced_at : existing?.synced_at ?? null } as T & Metadata;
}

export class Storage {
  readonly stores: Record<StoreName, Writable<unknown[]>> = Object.fromEntries(STORE_NAMES.map((name) => [name, writable<unknown[]>([])])) as unknown as Record<StoreName, Writable<unknown[]>>;
  constructor(private readonly crypto?: CryptoProvider) {}

  private async transaction<T>(name: StoreName, mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
    const db = await openDatabase();
    return new Promise((resolve, reject) => { const tx = db.transaction(name, mode); const request = action(tx.objectStore(name)); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed')); tx.onerror = () => reject(tx.error ?? new Error('IndexedDB transaction failed')); tx.oncomplete = () => { db.close(); openConnections.delete(db); }; });
  }

  async create<K extends StoreName>(name: K, input: Omit<RecordByStore[K], keyof Metadata> & Partial<Pick<RecordByStore[K], keyof Metadata>>): Promise<RecordByStore[K]> {
    assertStore(name); assertId((input as Partial<Metadata>).id); const now = Date.now(); const value = await this.prepare(name, metadata(input, now) as RecordByStore[K]);
    await this.transaction(name, 'readwrite', (store) => store.add(value));
    return (await this.restore(name, value as RecordByStore[K])) as RecordByStore[K];
  }

  async update<K extends StoreName>(name: K, input: RecordByStore[K]): Promise<RecordByStore[K]> {
    assertStore(name); assertId(input.id); const current = await this.get(name, input.id); if (!current) throw new Error('Record not found');
    const value = await this.prepare(name, metadata(input, Date.now(), current));
    await this.transaction(name, 'readwrite', (store) => store.put(value));
    return (await this.restore(name, value as RecordByStore[K])) as RecordByStore[K];
  }

  async get<K extends StoreName>(name: K, id: string): Promise<RecordByStore[K] | undefined> { assertStore(name); assertId(id); const value = await this.transaction(name, 'readonly', (store) => store.get(id)); return this.restore(name, value as RecordByStore[K] | undefined); }
  async list<K extends StoreName>(name: K, projectId?: string): Promise<RecordByStore[K][]> {
    assertStore(name); const values = await this.transaction(name, 'readonly', (store) => store.getAll()); const filtered = (values as RecordByStore[K][]).filter((value) => value.deleted_at === null && (!projectId || (value as RecordByStore[K] & { project_id?: string }).project_id === projectId)); return Promise.all(filtered.map((value) => this.restore(name, value))) as Promise<RecordByStore[K][]>;
  }
  async listTrash<K extends StoreName>(name: K): Promise<RecordByStore[K][]> { assertStore(name); const values = await this.transaction(name, 'readonly', (store) => store.getAll()); const deleted = (values as RecordByStore[K][]).filter((value) => value.deleted_at !== null); return Promise.all(deleted.map((value) => this.restore(name, value))) as Promise<RecordByStore[K][]>; }
  async purgeExpired(now = Date.now()): Promise<number> { let removed = 0; for (const name of STORE_NAMES) { const values = await this.transaction(name, 'readonly', (store) => store.getAll()) as unknown as Array<{ id: string; deleted_at: number | null }>; const expired = values.filter((value) => value.deleted_at !== null && now - value.deleted_at >= TRASH_RETENTION_MS); for (const value of expired) { await this.transaction(name, 'readwrite', (store) => store.delete(value.id)); removed += 1; } } return removed; }
  async softDelete<K extends StoreName>(name: K, id: string): Promise<RecordByStore[K]> { const value = await this.get(name, id); if (!value) throw new Error('Record not found'); return this.update(name, { ...value, deleted_at: Date.now() }); }
  async restoreRecord<K extends StoreName>(name: K, id: string): Promise<RecordByStore[K]> { const value = await this.get(name, id); if (!value) throw new Error('Record not found'); return this.update(name, { ...value, deleted_at: null }); }

  private async prepare<K extends StoreName>(name: K, value: RecordByStore[K]): Promise<RecordByStore[K]> { const fields = encryptedFields[name] ?? []; if (!fields.length) return value; if (!this.crypto) throw new Error(`Crypto provider required for ${name}`); const result = { ...value } as Record<string, unknown>; for (const field of fields) { const raw = result[field]; if (typeof raw === 'string') { result[`${field}_encrypted`] = await this.crypto.encrypt(raw); delete result[field]; } } return result as unknown as RecordByStore[K]; }
  private async restore<K extends StoreName>(name: K, value: RecordByStore[K] | undefined): Promise<RecordByStore[K] | undefined> { if (!value) return undefined; const fields = encryptedFields[name] ?? []; if (!fields.length) return value; if (!this.crypto) throw new Error(`Crypto provider required to read ${name}`); const result = { ...value } as Record<string, unknown>; for (const field of fields) { const envelope = result[`${field}_encrypted`]; if (envelope) result[field] = await this.crypto.decrypt(envelope as never); } return result as unknown as RecordByStore[K]; }
}
