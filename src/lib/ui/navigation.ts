import { writable, derived } from 'svelte/store';

export type ViewId = 'calendar' | 'launchpad' | 'quicknotes' | 'documents' | 'time-logs';

export const views: Array<{ id: ViewId; label: string }> = [
  { id: 'calendar', label: 'Calendar' },
  { id: 'launchpad', label: 'Launchpad' },
  { id: 'quicknotes', label: 'Quicknotes' },
  { id: 'documents', label: 'Documents' },
  { id: 'time-logs', label: 'Time Logs' },
];

export const activeView = writable<ViewId>('calendar');
export const clerkOpen = writable(true);
export const activeViewLabel = derived(activeView, (id) => views.find((view) => view.id === id)?.label ?? 'Calendar');

export function navigateTo(view: ViewId): void { activeView.set(view); }
export function toggleClerk(): void { clerkOpen.update((open) => !open); }
