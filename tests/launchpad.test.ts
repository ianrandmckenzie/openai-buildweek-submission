import { describe, expect, it } from 'vitest';
import { allTags, filterLinks, normalizeUrl, parseLinkInput } from '../src/lib/launchpad/links';
import { readFileSync } from 'node:fs';

describe('launchpad links', () => {
  it('normalizes bare domains and rejects unsafe protocols', () => { expect(normalizeUrl('example.com')).toBe('https://example.com/'); expect(() => normalizeUrl('javascript:alert(1)')).toThrow(); });
  it('parses titles, unique tags, description, and icon color', () => { expect(parseLinkInput('https://openai.com/docs', '', 'AI, ai, work', 'p1', 'Reference docs', '#ff0')).toEqual({ title: 'openai.com', url: 'https://openai.com/docs', tags: ['ai', 'work'], project_id: 'p1', description: 'Reference docs', icon_color: '#ff0' }); });
  it('filters links by text and tag and returns sorted tags', () => { const links = [{ title: 'Docs', url: 'https://openai.com/docs', tags: ['work', 'ai'] }, { title: 'News', url: 'https://example.com', tags: ['personal'] }]; expect(filterLinks(links, 'openai')).toHaveLength(1); expect(filterLinks(links, '', 'personal')).toHaveLength(1); expect(allTags(links)).toEqual(['ai', 'personal', 'work']); });
  it('closes create and edit modals when clicking their backdrop', () => { const source = readFileSync('src/lib/components/LaunchpadView.svelte', 'utf8'); expect(source).toContain('class="edit-overlay" on:click={(event) => event.target === event.currentTarget'); });
});
