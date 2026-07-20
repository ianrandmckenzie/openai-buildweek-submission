import { get, writable } from 'svelte/store';
import type { ClerkAIConfig, CloudSyncConfig } from '../integrations/custom-ai';
import { hydrateJsonState, readJsonState, writeJsonState } from '../storage/json-state';

export const defaultClerkAIConfig: ClerkAIConfig = { endpoint: 'http://localhost:11434/v1/chat/completions', apiKey: '', model: 'gemma4', maxTokens: 2048, transcriptionModel: 'gpt-4o-transcribe' };
const key = 'dashboard.clerk.ai-config.v1';
export const clerkAIConfig = writable<ClerkAIConfig>({ ...defaultClerkAIConfig, ...readJsonState<Partial<ClerkAIConfig>>(key, {}) });
void hydrateJsonState<Partial<ClerkAIConfig>>(key, {}).then((saved) => clerkAIConfig.set({ ...defaultClerkAIConfig, ...saved }));
export function saveClerkAIConfig(config: ClerkAIConfig): void { const normalized = { ...config, maxTokens: Number(config.maxTokens) }; writeJsonState(key, normalized); clerkAIConfig.set(normalized); }
export function currentClerkAIConfig(): ClerkAIConfig { return get(clerkAIConfig); }
export const cloudSyncConfig = writable<CloudSyncConfig>(readJsonState<CloudSyncConfig>('dashboard.cloud.sync-config.v1', { baseUrl: '', apiToken: '' }));
void hydrateJsonState<CloudSyncConfig>('dashboard.cloud.sync-config.v1', { baseUrl: '', apiToken: '' }).then((saved) => cloudSyncConfig.set(saved));
export function saveCloudSyncConfig(config: CloudSyncConfig): void { writeJsonState('dashboard.cloud.sync-config.v1', config); cloudSyncConfig.set(config); }
