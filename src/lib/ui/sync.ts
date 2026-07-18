import { writable } from 'svelte/store';

export type SyncState = 'local' | 'syncing' | 'synced' | 'offline' | 'error';
export const syncState = writable<SyncState>('local');
export const syncLabel: Record<SyncState, string> = { local: 'Local only', syncing: 'Syncing…', synced: 'Synced', offline: 'Offline', error: 'Sync error' };
export function setSyncState(state: SyncState): void { syncState.set(state); }
