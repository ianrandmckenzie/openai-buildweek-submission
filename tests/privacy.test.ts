import { beforeEach, describe, expect, it } from 'vitest';
import { applyObfuscation, blurValues, blurStrength, cycleObfuscation, obfuscationMode, setBlurStrength } from '../src/lib/ui/privacy';
import { setSyncState, syncLabel, syncState, type SyncState } from '../src/lib/ui/sync';

describe('privacy controls', () => {
  beforeEach(() => { obfuscationMode.set('none'); blurStrength.set('m'); applyObfuscation('none'); });
  it('cycles none, some, all, and back to none', () => { expect(cycleObfuscation()).toBe('some'); expect(cycleObfuscation()).toBe('all'); expect(cycleObfuscation()).toBe('none'); });
  it('maps blur strength to a CSS variable', () => { setBlurStrength('2xl'); expect(document.documentElement.style.getPropertyValue('--blur-intensity')).toBe(blurValues['2xl']); });
  it('applies a ternary root class', () => { applyObfuscation('some'); expect(document.documentElement.classList.contains('obfuscate-some')).toBe(true); expect(document.documentElement.classList.contains('obfuscate-none')).toBe(false); });
});

describe('sync status', () => {
  it('exposes readable status labels and transitions', () => { setSyncState('syncing'); let value: SyncState = 'local'; const unsubscribe = syncState.subscribe((state) => { value = state; }); expect(value).toBe('syncing'); expect(syncLabel[value]).toBe('Syncing…'); unsubscribe(); });
});
