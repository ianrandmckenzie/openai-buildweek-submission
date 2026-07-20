import { writable } from 'svelte/store';
import type { CalendarEvent } from './events';
import type { CalendarTask } from './tasks';
export const openCalendarRequest = writable<CalendarEvent | CalendarTask | null>(null);
export function requestCalendarOpen(item: CalendarEvent | CalendarTask): void { openCalendarRequest.set(item); }
