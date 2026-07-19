export interface SyncRecord { id: string; updated_at: number; deleted_at: number | null; synced_at: number | null; [key: string]: unknown; }
export interface SyncConflict { id: string; local: SyncRecord; remote: SyncRecord; winner: 'local' | 'remote'; }
export interface ReconcileResult { records: SyncRecord[]; conflicts: SyncConflict[]; }

export function newestRecord(local: SyncRecord, remote: SyncRecord): 'local' | 'remote' {
  if (local.updated_at === remote.updated_at) return 'local';
  return local.updated_at > remote.updated_at ? 'local' : 'remote';
}

export function reconcileRecords(local: SyncRecord[], remote: SyncRecord[]): ReconcileResult {
  const byId = new Map(local.map((record) => [record.id, record])); const conflicts: SyncConflict[] = [];
  for (const candidate of remote) {
    const existing = byId.get(candidate.id); if (!existing) { byId.set(candidate.id, candidate); continue; }
    const winner = newestRecord(existing, candidate); conflicts.push({ id: candidate.id, local: existing, remote: candidate, winner }); byId.set(candidate.id, winner === 'local' ? existing : candidate);
  }
  return { records: [...byId.values()], conflicts };
}

export function buildSyncEnvelope(records: SyncRecord[], cursor: number | null = null): { version: 1; cursor: number | null; records: SyncRecord[] } { return { version: 1, cursor, records }; }
export function validateSyncEnvelope(value: unknown): value is { version: 1; cursor: number | null; records: SyncRecord[] } {
  if (!value || typeof value !== 'object') return false; const envelope = value as Record<string, unknown>; if (envelope.version !== 1 || (envelope.cursor !== null && typeof envelope.cursor !== 'number') || !Array.isArray(envelope.records)) return false;
  return envelope.records.every((record) => Boolean(record) && typeof record === 'object' && typeof (record as SyncRecord).id === 'string' && typeof (record as SyncRecord).updated_at === 'number' && ('deleted_at' in record));
}
