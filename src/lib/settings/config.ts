import type { RecordByStore, StoreName } from '../storage/models';

export interface DashboardExport { format: 'kenzie-dashboard'; version: 1; exported_at: number; stores: Partial<{ [K in StoreName]: RecordByStore[K][] }>; }

export function createDashboardExport(data: Partial<{ [K in StoreName]: RecordByStore[K][] }>, exportedAt = Date.now()): DashboardExport { return { format: 'kenzie-dashboard', version: 1, exported_at: exportedAt, stores: data }; }

export function serializeDashboardExport(data: DashboardExport): string { return JSON.stringify(data, null, 2); }

export function parseDashboardExport(serialized: string): DashboardExport {
  let value: unknown; try { value = JSON.parse(serialized); } catch { throw new Error('Configuration file is not valid JSON'); }
  if (!value || typeof value !== 'object') throw new Error('Configuration file must contain an object');
  const candidate = value as Partial<DashboardExport>;
  if (candidate.format !== 'kenzie-dashboard' || candidate.version !== 1 || !candidate.stores || typeof candidate.stores !== 'object') throw new Error('Unsupported dashboard configuration format');
  for (const [name, records] of Object.entries(candidate.stores)) { if (!['projects', 'notes', 'tasks', 'documents', 'time_logs', 'launchpad_links', 'settings'].includes(name) || !Array.isArray(records)) throw new Error(`Invalid store payload: ${name}`); }
  return candidate as DashboardExport;
}

export function mergeImport<T>(existing: T[], incoming: T[], getId: (value: T) => string): T[] { const merged = new Map(existing.map((value) => [getId(value), value])); for (const value of incoming) merged.set(getId(value), value); return [...merged.values()]; }
