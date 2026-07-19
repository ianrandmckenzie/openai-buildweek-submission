import { describe, expect, it } from 'vitest';
import { createDashboardExport, mergeImport, parseDashboardExport, serializeDashboardExport } from '../src/lib/settings/config';

describe('settings data bridge', () => {
  it('round-trips a versioned structured export', () => { const exported = createDashboardExport({ projects: [{ id: 'p1' } as any] }, 123); expect(parseDashboardExport(serializeDashboardExport(exported))).toEqual(exported); });
  it('rejects invalid JSON and unsupported payloads', () => { expect(() => parseDashboardExport('{')).toThrow('valid JSON'); expect(() => parseDashboardExport(JSON.stringify({ format: 'other', version: 1, stores: {} }))).toThrow('Unsupported'); });
  it('merges imports by stable id', () => { expect(mergeImport([{ id: 'a', value: 1 }, { id: 'b', value: 2 }], [{ id: 'b', value: 3 }, { id: 'c', value: 4 }], (item) => item.id)).toEqual([{ id: 'a', value: 1 }, { id: 'b', value: 3 }, { id: 'c', value: 4 }]); });
});
