import { describe, expect, it } from 'vitest';
import { faviconUrl, partitionPinned, reorderLinks, toggleLinkFlag } from '../src/lib/launchpad/actions';
describe('launchpad card actions', () => {
  it('builds favicon URLs with a safe fallback', () => { expect(faviconUrl('https://example.com')).toContain('example.com'); expect(faviconUrl('bad')).toBe('/tmp-icons/launchpad.svg'); });
  it('reorders cards immutably and toggles flags', () => { const links = [{ id: 'a', pinned: false }, { id: 'b', pinned: false }]; expect(reorderLinks(links, 0, 1).map((link) => link.id)).toEqual(['b', 'a']); expect(toggleLinkFlag(links[0], 'pinned').pinned).toBe(true); });
  it('partitions pinned links into a dedicated section', () => { const sections = partitionPinned([{ id: 'a', pinned: true }, { id: 'b', pinned: false }]); expect(sections.pinned.map((item) => item.id)).toEqual(['a']); expect(sections.other.map((item) => item.id)).toEqual(['b']); });
});
