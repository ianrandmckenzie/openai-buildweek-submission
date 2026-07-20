import { writable } from 'svelte/store';
export const settingsOpen = writable(false);
export type SettingsTab = 'general' | 'projects' | 'screen-privacy' | 'advanced';
export const settingsTab = writable<SettingsTab>('general');
export function toggleSettings(tab: SettingsTab = 'general'): void { settingsTab.set(tab); settingsOpen.update((open) => !open); }
export function openSettings(tab: SettingsTab = 'general'): void { settingsTab.set(tab); settingsOpen.set(true); }
export function closeSettings(): void { settingsOpen.set(false); }
