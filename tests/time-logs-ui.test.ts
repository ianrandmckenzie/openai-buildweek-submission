import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('time logs view', () => {
  it('keeps project scope controls in the time-log toolbar', () => {
    const source = readFileSync('src/lib/components/TimeLogsView.svelte', 'utf8');
    expect(source).toContain("import ScopeToggle from './ScopeToggle.svelte'");
    expect(source).toContain('<ScopeToggle');
  });
  it('closes the edit modal when clicking its backdrop', () => {
    const source = readFileSync('src/lib/components/TimeLogsView.svelte', 'utf8');
    expect(source).toContain('<div class="backdrop" role="presentation" on:click={(event) => event.target === event.currentTarget');
  });
});
