import { writable } from 'svelte/store';

export const quicknotesScope = writable<'project' | 'all'>('project');
