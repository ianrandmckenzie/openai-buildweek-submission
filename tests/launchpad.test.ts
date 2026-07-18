import { describe, expect, it } from 'vitest';
import { allTags, filterLinks, normalizeUrl, parseLinkInput } from '../src/lib/launchpad/links';

describe('launchpad links', () => {
  it('normalizes bare domains and rejects unsafe protocols', () => { expect(normalizeUrl('example.com')).toBe('https://example.com/'); expect(() => normalizeUrl('javascript:alert(1)')).toThrow(); });
  it('parses titles and unique tags', () => { expect(parseLinkInput('https://openai.com/docs', '', 'AI, ai, work', 'p1')).toEqual({ title: 'openai.com', url: 'https://openai.com/docs', tags: ['ai', 'work'], project_id: 'p1' }); });
  it('filters links by text and tag and returns sorted tags', () => { const links = [{ title: 'Docs', url: 'https://openai.com/docs', tags: ['work', 'ai'] }, { title: 'News', url: 'https://example.com', tags: ['personal'] }]; expect(filterLinks(links, 'openai')).toHaveLength(1); expect(filterLinks(links, '', 'personal')).toHaveLength(1); expect(allTags(links)).toEqual(['ai', 'personal', 'work']); });
});
