export function describeAIError(status: number, operation: 'chat' | 'transcription'): Error {
  if (status === 429) return new Error(`${operation === 'transcription' ? 'Voice transcription' : 'Clerk AI'} is rate-limited (429). Check your provider quota, billing, or retry after a short wait.`);
  if (status === 401 || status === 403) return new Error(`Clerk AI configuration was rejected (${status}). Check the API key in Settings → Advanced.`);
  if (status === 404) return new Error(`Clerk AI configuration was not found (404). Check the AI endpoint and model name in Settings → Advanced.`);
  if (status >= 500) return new Error(`The configured AI service is unavailable (${status}). Check the endpoint or try again later.`);
  return new Error(`${operation === 'transcription' ? 'Voice transcription' : 'Clerk AI'} request failed (${status}). Check Settings → Advanced.`);
}
