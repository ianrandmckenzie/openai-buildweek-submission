import type { ClerkAIConfig } from '../integrations/custom-ai';
import { describeAIError } from './ai-errors';

export async function transcribeAudio(blob: Blob, config: ClerkAIConfig): Promise<string> {
  const form = new FormData(); form.append('file', blob, 'clerk-message.webm'); form.append('model', config.transcriptionModel);
  const response = await fetch(`${config.endpoint.replace(/\/chat\/completions\/?$/, '').replace(/\/$/, '')}/audio/transcriptions`, { method: 'POST', headers: config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {}, body: form });
  if (!response.ok) throw describeAIError(response.status, 'transcription');
  const data = await response.json() as { text?: string }; return data.text?.trim() ?? '';
}
