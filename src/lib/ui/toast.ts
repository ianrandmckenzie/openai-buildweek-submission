import { writable } from 'svelte/store';

export type ToastTone = 'success' | 'error' | 'info';
export interface Toast { id: number; message: string; tone: ToastTone; }

export const toasts = writable<Toast[]>([]);
let nextId = 0;

export function showToast(message: string, tone: ToastTone = 'success', duration = 3600): void {
  const id = ++nextId;
  toasts.update((items) => [...items, { id, message, tone }]);
  setTimeout(() => toasts.update((items) => items.filter((item) => item.id !== id)), duration);
}

export function dismissToast(id: number): void {
  toasts.update((items) => items.filter((item) => item.id !== id));
}
