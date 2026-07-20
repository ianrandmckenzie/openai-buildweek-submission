import { writable } from 'svelte/store';
import { hydrateJsonState, readJsonState, writeJsonState } from '../storage/json-state';
export type DisplayedDays = 'full-week' | 'weekdays' | 'weekdays-full-weekends';
export interface CalendarPreferences { weekStartsOn: number; displayedDays: DisplayedDays; }
export const defaultCalendarPreferences: CalendarPreferences = { weekStartsOn: 0, displayedDays: 'full-week' };
const key = 'dashboard.calendar.preferences.v1';
export const calendarPreferences = writable<CalendarPreferences>({ ...defaultCalendarPreferences, ...readJsonState<Partial<CalendarPreferences>>(key, {}) });
void hydrateJsonState<Partial<CalendarPreferences>>(key, {}).then((saved) => calendarPreferences.set({ ...defaultCalendarPreferences, ...saved }));
export function saveCalendarPreferences(value: CalendarPreferences): void { writeJsonState(key, value); calendarPreferences.set(value); }
export function visibleWeekdayIndexes(preferences: CalendarPreferences): number[] { const order = Array.from({ length: 7 }, (_, index) => (preferences.weekStartsOn + index) % 7); return preferences.displayedDays === 'weekdays' ? order.filter((day) => day !== 0 && day !== 6) : order; }
