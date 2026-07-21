import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { searchRecords } from '../src/lib/search/index';

describe('global search', () => {
  it('gives the Open result action clear hover feedback', () => {
    const source = readFileSync('src/lib/components/SearchSidebar.svelte', 'utf8');
    expect(source).toMatch(/\.open-result:hover\{[^}]*cursor:pointer;[^}]*text-decoration:underline/);
  });
  it('indexes tasks, events, notes/docs, launchpad links, and time logs', () => {
    const result = searchRecords({
      tasks: [{ id: 't', project_id: 'p', title: 'Task alpha', completed: false, created_at: 1, updated_at: 1, deleted_at: null, synced_at: null }],
      events: [{ id: 'e', project_id: 'p', title: 'Event beta', starts_at: 1, created_at: 1, updated_at: 1, deleted_at: null, synced_at: null }],
      notes: [{ id: 'n', project_id: 'p', title: 'Note gamma', content: 'searchable', created_at: 1, updated_at: 1, deleted_at: null, synced_at: null }],
      documents: [{ id: 'd', project_id: 'p', title: 'Doc delta', content: 'searchable', created_at: 1, updated_at: 1, deleted_at: null, synced_at: null }],
      launchpad_links: [{ id: 'l', project_id: 'p', title: 'Link epsilon', url: 'https://example.com', created_at: 1, updated_at: 1, deleted_at: null, synced_at: null }],
      time_logs: [{ id: 'log', project_id: 'p', task_id: 'Task zeta', started_at: 1, created_at: 1, updated_at: 1, deleted_at: null, synced_at: null }]
    }, '');
    expect(result.map((item) => item.type)).toEqual(['Task', 'Event', 'Quicknote / Doc', 'Doc', 'Launchpad', 'Time log']);
  });
});
