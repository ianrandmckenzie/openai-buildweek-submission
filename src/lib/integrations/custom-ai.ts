export interface CloudSyncConfig { baseUrl: string; apiToken: string; }
export interface ClerkAIConfig { endpoint: string; apiKey: string; model: string; maxTokens: number; transcriptionModel: string; }
export interface ClerkPromptRequest { messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>; }
export interface AIRequestPayload extends ClerkPromptRequest { model: string; max_tokens: number; }

function endpointUrl(value: string): string { const url = new URL(value); if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Endpoint must use HTTP or HTTPS'); return url.toString().replace(/\/$/, ''); }
function authHeaders(token: string): Record<string, string> { return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' }; }

export class CustomApiClient {
  constructor(private readonly fetcher: typeof fetch = fetch) {}
  async sync<T>(config: CloudSyncConfig, path: string, body: unknown): Promise<T> { const response = await this.fetcher(`${endpointUrl(config.baseUrl)}/${path.replace(/^\//, '')}`, { method: 'POST', headers: authHeaders(config.apiToken), body: JSON.stringify(body) }); if (!response.ok) throw new Error(`Sync request failed with status ${response.status}`); return response.json() as Promise<T>; }
  async clerk(config: ClerkAIConfig, request: ClerkPromptRequest): Promise<unknown> { const payload: AIRequestPayload = { ...request, model: config.model, max_tokens: config.maxTokens }; const response = await this.fetcher(endpointUrl(config.endpoint), { method: 'POST', headers: authHeaders(config.apiKey), body: JSON.stringify(payload) }); if (!response.ok) throw new Error(`Clerk request failed with status ${response.status}`); return response.json(); }
}

export function validateAIConfig(config: ClerkAIConfig): void { if (!config.model.trim()) throw new Error('AI model is required'); if (!Number.isInteger(config.maxTokens) || config.maxTokens < 1 || config.maxTokens > 200000) throw new Error('Max tokens must be a positive bounded integer'); endpointUrl(config.endpoint); }
