import { describe, expect, it } from 'vitest';
import { get } from 'svelte/store';
import { searchScope, routinesScope, launchpadScope, calendarScope } from '../src/lib/projects/view-scopes';

describe('view-local project scopes', () => {
  it('keeps sidebar scopes independent', () => {
    searchScope.set('project'); routinesScope.set('all'); launchpadScope.set('project'); calendarScope.set('all');
    expect(get(searchScope)).toBe('project'); expect(get(routinesScope)).toBe('all');
    expect(get(launchpadScope)).toBe('project'); expect(get(calendarScope)).toBe('all');
  });
});
