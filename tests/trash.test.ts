import { beforeEach, describe, expect, it } from 'vitest';
import { resetDatabase, Storage, TRASH_RETENTION_MS } from '../src/lib/storage/idb';
import { daysRemaining, isExpired, purgeAt } from '../src/lib/trash/lifecycle';

beforeEach(async () => { await resetDatabase(); });
describe('trash lifecycle', () => {
  it('calculates the 30-day retention window', () => { const deleted = 1000; expect(purgeAt(deleted)).toBe(deleted + TRASH_RETENTION_MS); expect(daysRemaining(deleted, deleted)).toBe(30); expect(isExpired(deleted, deleted + TRASH_RETENTION_MS)).toBe(true); });
  it('lists soft-deleted records, restores them, and purges expired records', async () => { const storage = new Storage(); const project = await storage.create('projects', { id: 'p1', name: 'Trash me' }); await storage.softDelete('projects', project.id); expect(await storage.list('projects')).toHaveLength(0); expect(await storage.listTrash('projects')).toHaveLength(1); await storage.restoreRecord('projects', project.id); expect(await storage.listTrash('projects')).toHaveLength(0); await storage.softDelete('projects', project.id); const removed = await storage.purgeExpired(Date.now() + TRASH_RETENTION_MS); expect(removed).toBe(1); expect(await storage.listTrash('projects')).toHaveLength(0); });
});
