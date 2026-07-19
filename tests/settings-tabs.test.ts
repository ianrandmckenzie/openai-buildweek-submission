import { beforeEach, describe, expect, it } from 'vitest';
import { closeSettings, openSettings, settingsOpen, settingsTab, toggleSettings } from '../src/lib/ui/settings';

beforeEach(() => closeSettings());
describe('settings tabs', () => {
  it('opens the general tab by default', () => { toggleSettings(); let tab = 'projects'; const unsubscribe = settingsTab.subscribe((value) => { tab = value; }); expect(tab).toBe('general'); unsubscribe(); });
  it('opens directly to Projects from the project rail action', () => { openSettings('projects'); let open = false; let tab = 'general'; const un1 = settingsOpen.subscribe((value) => { open = value; }); const un2 = settingsTab.subscribe((value) => { tab = value; }); expect(open).toBe(true); expect(tab).toBe('projects'); un1(); un2(); });
});
