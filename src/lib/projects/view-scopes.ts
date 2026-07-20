import { writable } from 'svelte/store';

export const searchScope = writable<'project' | 'all'>('all');
export const routinesScope = writable<'project' | 'all'>('project');
export const launchpadScope = writable<'project' | 'all'>('project');
export const calendarScope = writable<'project' | 'all'>('project');
