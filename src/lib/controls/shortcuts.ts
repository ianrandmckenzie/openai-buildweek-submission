import { writable } from 'svelte/store';
import { toggleSettings } from '../ui/settings';
import { activeView, navigateTo, type ViewId } from '../ui/navigation';

export type ShortcutAction = 'open_settings' | 'focus_clerk' | 'new_event' | 'new_note';
export interface ShortcutContext { target?: { tagName?: string; isContentEditable?: boolean }; ctrlKey?: boolean; metaKey?: boolean; altKey?: boolean; shiftKey?: boolean; }
export interface ShortcutCommand { action: ShortcutAction; sequence: string; }

export const shortcutAction = writable<ShortcutAction | null>(null);
export const shortcutRegistry: ShortcutCommand[] = [
  { action: 'open_settings', sequence: 'CtrlOrMeta+K' }, { action: 'focus_clerk', sequence: 'CtrlOrMeta+/' }, { action: 'new_event', sequence: 'N E' }, { action: 'new_note', sequence: 'N N' },
];

export function isTypingTarget(context: ShortcutContext): boolean { const tag = context.target?.tagName?.toLowerCase(); return Boolean(context.target?.isContentEditable || tag === 'input' || tag === 'textarea' || tag === 'select'); }
export function matchShortcut(event: ShortcutContext & { key: string }): ShortcutAction | undefined {
  const key = event.key.toLowerCase(); const modified = Boolean(event.ctrlKey || event.metaKey);
  if (modified && key === 'k') return 'open_settings'; if (modified && key === '/') return 'focus_clerk'; if (!modified && !event.altKey && !event.shiftKey && key === 'n') return undefined; return undefined;
}

export function dispatchShortcut(action: ShortcutAction): void {
  shortcutAction.set(action);
  if (action === 'open_settings') toggleSettings();
  if (action === 'new_note') navigateTo('quicknotes');
  if (action === 'new_event') navigateTo('calendar');
}

export function createShortcutListener(dispatch: (action: ShortcutAction) => void = dispatchShortcut): { handle: (event: KeyboardEvent) => void; destroy: () => void } {
  let pendingN = false; let timeout: ReturnType<typeof setTimeout> | undefined;
  const handle = (event: KeyboardEvent): void => {
    const context = event as unknown as ShortcutContext & { key: string }; const modified = Boolean(context.ctrlKey || context.metaKey);
    if (isTypingTarget(context) && !modified) return;
    const direct = matchShortcut(context); if (direct) { event.preventDefault(); dispatch(direct); return; }
    const key = event.key.toLowerCase(); if (!modified && !event.altKey && !event.shiftKey && key === 'n') { pendingN = true; if (timeout) clearTimeout(timeout); timeout = setTimeout(() => { pendingN = false; }, 1000); return; }
    if (pendingN && !modified && !event.altKey && !event.shiftKey && (key === 'e' || key === 'n')) { pendingN = false; if (timeout) clearTimeout(timeout); event.preventDefault(); dispatch(key === 'e' ? 'new_event' : 'new_note'); }
  };
  if (typeof window !== 'undefined') window.addEventListener('keydown', handle);
  return { handle, destroy: () => { if (typeof window !== 'undefined') window.removeEventListener('keydown', handle); if (timeout) clearTimeout(timeout); } };
}
