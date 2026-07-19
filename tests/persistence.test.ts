import { beforeEach, describe, expect, it } from 'vitest';
import { openDatabase, resetDatabase, Storage } from '../src/lib/storage/idb';
import { PersistentCollection } from '../src/lib/storage/persistent';

beforeEach(async () => { await resetDatabase(); });
describe('refresh persistence', () => {
  it('persists projects and events across database handles', async () => { const first = new Storage(); await first.create('projects', { id: 'p1', name: 'Coffee project' }); await first.create('events', { id: 'e1', project_id: 'p1', title: 'Persisted event', starts_at: 1000 }); const db = await openDatabase(); db.close(); const second = new Storage(); expect((await second.list('projects'))[0].name).toBe('Coffee project'); expect((await second.list('events'))[0].title).toBe('Persisted event'); });
  it('upgrades the existing schema with an events store', async () => { const db = await openDatabase(); expect(db.objectStoreNames.contains('events')).toBe(true); db.close(); });
  it('assigns an id when a persistent collection creates a record without one', async () => { const links = new PersistentCollection('launchpad_links'); const created = await links.create({ project_id: 'p1', title: 'Example', url: 'https://example.com', tags: [] }); expect(created.id).toMatch(/^[0-9a-f-]{36}$/); expect((await new Storage().get('launchpad_links', created.id))?.title).toBe('Example'); });
});
