import { describe, expect, it, vi } from 'vitest';
import { describeAIError } from '../src/lib/clerk/ai-errors';
import { askOllama } from '../src/lib/clerk/ollama';
import { transcribeAudio } from '../src/lib/clerk/transcribe';

describe('Clerk AI diagnostics', () => {
  it('explains rate limits and configuration failures', () => {
    expect(describeAIError(429, 'chat').message).toContain('rate-limited');
    expect(describeAIError(401, 'chat').message).toContain('API key');
    expect(describeAIError(404, 'transcription').message).toContain('endpoint and model');
  });

  it('turns an unreachable chat endpoint into an actionable error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    await expect(askOllama([{ role: 'user', content: 'Hi' }], 'http://localhost:9/v1/chat/completions')).rejects.toThrow('could not connect');
  });

  it('reports transcription rate limits without an unhandled raw status error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 429 })));
    const config = { endpoint: 'https://api.openai.com/v1/chat/completions', apiKey: 'key', model: 'gemma4', maxTokens: 100, transcriptionModel: 'gpt-4o-transcribe' };
    await expect(transcribeAudio(new Blob(['audio']), config)).rejects.toThrow('Voice transcription is rate-limited');
  });
});
