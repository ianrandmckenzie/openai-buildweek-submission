import { writable } from 'svelte/store';
import { commandReply, parseClerkInput, type ClerkCommand } from './commands';

export interface ClerkMessage { id: string; role: 'user' | 'clerk'; content: string; created_at: number; command?: ClerkCommand['type']; }
export const clerkMessages = writable<ClerkMessage[]>([]);
export const clerkProcessing = writable(false);

export function submitClerkInput(input: string): ClerkMessage[] {
  const command = parseClerkInput(input); const now = Date.now(); const messages: ClerkMessage[] = [{ id: crypto.randomUUID(), role: 'user', content: input.trim(), created_at: now, command: command.type }, { id: crypto.randomUUID(), role: 'clerk', content: commandReply(command), created_at: now + 1 }];
  clerkMessages.update((history) => [...history, ...messages]); return messages;
}

export function clearClerkHistory(): void { clerkMessages.set([]); }
