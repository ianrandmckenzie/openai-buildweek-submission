import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('tmp icon set', () => {
  it('contains the core application icons used by the shell', () => {
    const root = resolve(process.cwd(), 'public/tmp-icons');
    for (const icon of ['add-plus', 'close-x', 'moon', 'sun', 'obfuscation', 'settings-cog', 'sync', 'play', 'nav-back', 'nav-forward', 'checkbox-empty', 'calendar-plus', 'launchpad']) {
      expect(existsSync(resolve(root, `${icon}.svg`)), icon).toBe(true);
    }
  });
});
