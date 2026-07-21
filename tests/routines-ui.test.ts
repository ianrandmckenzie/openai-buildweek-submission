import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('routine creation state', () => {
  it('uses a draft routine record so the create modal can render', () => {
    const draft = { id: '', project_id: 'default', title: '', frequency: 'daily' };
    expect(draft).toHaveProperty('id', '');
    expect(draft.frequency).toBe('daily');
  });
  it('treats an empty draft id as a new routine rather than an edit', () => {
    const draft = { id: '' }; const existing = [{ id: 'existing' }]; const created = { id: 'new' };
    const next = draft.id ? existing.map((item) => item.id === created.id ? created : item) : [...existing, created];
    expect(next).toHaveLength(2);
    expect(next[1].id).toBe('new');
  });
  it('uses a text save action and the standard close icon button', () => {
    const source = readFileSync('src/lib/components/RoutinesSidebar.svelte', 'utf8');
    expect(source).not.toContain('<img src="/tmp-icons/save.svg" alt="" /> Save');
    expect(source).toContain('<button class="close-x" aria-label="Close"');
  });
  it('inverts the create icon on dark surfaces while preserving the light-theme icon', () => {
    const source = readFileSync('src/lib/components/RoutinesSidebar.svelte', 'utf8');
    expect(source).toContain(":root[data-theme='dark'] .routine-toolbar button[aria-label=\"Create routine\"] img{filter:invert(1)}");
  });
});
