import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('tmp icon set', () => {
  it('contains the core application icons used by the shell', () => {
    const root = resolve(process.cwd(), 'public/tmp-icons');
    for (const icon of ['add-plus', 'close-x', 'moon', 'sun', 'obfuscation', 'settings-cog', 'sync', 'play', 'microphone', 'microphone-hot', 'nav-back', 'nav-forward', 'checkbox-empty', 'calendar-plus', 'launchpad']) {
      expect(existsSync(resolve(root, `${icon}.svg`)), icon).toBe(true);
    }
  });

  it('keeps dark-theme Clerk and Quicknotes light-button icons readable', () => {
    const clerk = readFileSync('src/lib/components/ClerkPanel.svelte', 'utf8');
    const quicknotes = readFileSync('src/lib/components/QuicknotesView.svelte', 'utf8');
    expect(clerk).toMatch(/:root\[data-theme='dark'\] \.prompt-form button img\{filter:none\}/);
    expect(quicknotes).toMatch(/:root\[data-theme='dark'\] \.modal footer button img\s*\{\s*filter:\s*none;/);
  });
});
