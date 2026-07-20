import { writable } from 'svelte/store';
import type { TimeLogEntry } from './state';
export const openTimeLogRequest = writable<TimeLogEntry | null>(null);
export function requestTimeLogOpen(item: TimeLogEntry): void { openTimeLogRequest.set(item); }
