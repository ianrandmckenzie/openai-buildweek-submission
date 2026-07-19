import { describe, expect, it } from 'vitest';
import { buildSyncEnvelope, newestRecord, reconcileRecords, validateSyncEnvelope, type SyncRecord } from '../src/lib/sync/reconcile';
const record = (id: string, updated_at: number, deleted_at: number | null = null): SyncRecord => ({ id, updated_at, deleted_at, synced_at: null, value: id });

describe('sync reconciliation', () => {
  it('uses newest timestamps and preserves tombstones', () => { const result = reconcileRecords([record('a', 1), record('b', 4)], [record('a', 2, 2), record('c', 1)]); expect(result.records.find((item) => item.id === 'a')?.deleted_at).toBe(2); expect(result.records).toHaveLength(3); expect(result.conflicts.find((conflict) => conflict.id === 'a')?.winner).toBe('remote'); });
  it('uses local data as the deterministic equal-timestamp winner', () => { expect(newestRecord(record('a', 3), record('a', 3, 3))).toBe('local'); });
  it('validates versioned sync envelopes', () => { const envelope = buildSyncEnvelope([record('a', 1)], 5); expect(validateSyncEnvelope(envelope)).toBe(true); expect(validateSyncEnvelope({ ...envelope, version: 2 })).toBe(false); expect(validateSyncEnvelope({ ...envelope, records: [{ id: 'a' }] })).toBe(false); });
});
