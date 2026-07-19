import { beforeEach, describe, expect, it } from 'vitest';
import { setSidebarView, sidebarView, sidebarViews, showsClerkFooter } from '../src/lib/ui/sidebar';

beforeEach(() => sidebarView.set('clerk'));
describe('focus sidebar views', () => {
  it('defines Clerk, Search, Routines, and Docs as separate views', () => { expect(sidebarViews.map((view) => view.id)).toEqual(['clerk', 'search', 'routines', 'docs']); });
  it('switches focus view independently from main navigation', () => { setSidebarView('routines'); let current = 'clerk'; const unsubscribe = sidebarView.subscribe((view) => { current = view; }); expect(current).toBe('routines'); unsubscribe(); });
  it('shows the Chat/Drafts/History footer only for Clerk', () => { expect(showsClerkFooter('clerk')).toBe(true); expect(showsClerkFooter('search')).toBe(false); expect(showsClerkFooter('routines')).toBe(false); expect(showsClerkFooter('docs')).toBe(false); });
});
