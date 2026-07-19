import { writable, type Writable } from 'svelte/store';
import { Storage } from './idb';
import type { RecordByStore, StoreName } from './models';

export class PersistentCollection<K extends StoreName> {
  readonly items: Writable<RecordByStore[K][]> = writable([]);
  private readonly storage: Storage;
  constructor(private readonly storeName: K, storage = new Storage()) { this.storage = storage; }
  async load(projectId?: string): Promise<RecordByStore[K][]> { const records = await this.storage.list(this.storeName, projectId); this.items.set(records); return records; }
  async create(input: Omit<RecordByStore[K], keyof import('./models').Metadata> & Partial<Pick<RecordByStore[K], keyof import('./models').Metadata>>): Promise<RecordByStore[K]> { const record = await this.storage.create(this.storeName, { ...input, id: (input as Partial<{ id: string }>).id || crypto.randomUUID() }); this.items.update((records) => [...records, record]); return record; }
  async update(record: RecordByStore[K]): Promise<RecordByStore[K]> { const updated = await this.storage.update(this.storeName, record); this.items.update((records) => records.map((item) => item.id === updated.id ? updated : item)); return updated; }
  async softDelete(id: string): Promise<RecordByStore[K]> { const deleted = await this.storage.softDelete(this.storeName, id); this.items.update((records) => records.filter((item) => item.id !== id)); return deleted; }
}
