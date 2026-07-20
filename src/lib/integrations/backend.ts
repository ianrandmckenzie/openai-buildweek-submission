import type { SyncRecord } from '../storage/models';

export interface BackendConfig {
  enabled: boolean;
  baseUrl: string;
  deviceToken?: string;
  deviceId?: string;
  syncMode?: 'manual' | 'background';
}

export interface BackendClient {
  health(): Promise<unknown>;
  pair(payload: unknown): Promise<unknown>;
  listDevices(): Promise<unknown>;
  pushSync(records: SyncRecord[]): Promise<unknown>;
  pullSync(cursor?: number | null): Promise<unknown>;
  exchangeSync(records: SyncRecord[], cursor?: number | null): Promise<unknown>;
  getStatus(): Promise<unknown>;
}

export function createBackendClient(config: BackendConfig): BackendClient {
  const request = async (path: string, init: RequestInit = {}) => {
    if (!config.enabled) throw new Error('DeskClerk backend is disabled');
    const headers = new Headers(init.headers);
    headers.set('content-type', 'application/json');
    if (config.deviceToken) headers.set('authorization', `Bearer ${config.deviceToken}`);
    const response = await fetch(`${config.baseUrl.replace(/\/$/, '')}${path}`, { ...init, headers });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body?.error?.message ?? `Backend request failed (${response.status})`);
    return body;
  };
  return {
    health: () => request('/health'),
    pair: (payload) => request('/api/v1/devices/pair', { method: 'POST', body: JSON.stringify(payload) }),
    listDevices: () => request('/api/v1/devices'),
    pushSync: (records) => request('/api/v1/sync/push', { method: 'POST', body: JSON.stringify({ version: 1, records }) }),
    pullSync: (cursor = null) => request('/api/v1/sync/pull', { method: 'POST', body: JSON.stringify({ version: 1, cursor, records: [] }) }),
    exchangeSync: (records, cursor = null) => request('/api/v1/sync/exchange', { method: 'POST', body: JSON.stringify({ version: 1, cursor, records }) }),
    getStatus: () => request('/api/v1/sync/status'),
  };
}
