import { describe, expect, it, vi } from 'vitest';
import { createShortcutListener, isTypingTarget, matchShortcut } from '../src/lib/controls/shortcuts';

describe('keyboard shortcuts', () => {
  it('matches modifier shortcuts and suppresses typing targets', () => { expect(matchShortcut({ key: 'k', ctrlKey: true })).toBe('open_settings'); expect(matchShortcut({ key: '/', metaKey: true })).toBe('focus_clerk'); expect(isTypingTarget({ target: { tagName: 'INPUT' } })).toBe(true); expect(isTypingTarget({ target: { tagName: 'DIV' } })).toBe(false); });
  it('routes N+E and ignores plain shortcuts while typing', () => { const dispatch = vi.fn(); const listener = createShortcutListener(dispatch); const event = (key: string, target?: { tagName?: string }) => listener.handle({ key, target, preventDefault: vi.fn() } as unknown as KeyboardEvent); event('n'); event('e'); expect(dispatch).toHaveBeenCalledWith('new_event'); event('n', { tagName: 'INPUT' }); event('e', { tagName: 'INPUT' }); expect(dispatch).toHaveBeenCalledTimes(1); listener.destroy(); });
});
