import { writable } from 'svelte/store';
import type { CalendarEvent } from './events';
import type { CalendarTask } from './tasks';
export const createCalendarRequest = writable<'event' | 'task' | null>(null);
export const openCalendarRequest = writable<CalendarEvent | CalendarTask | null>(null);
export function requestCalendarOpen(item: CalendarEvent | CalendarTask): void { openCalendarRequest.set(item); }
