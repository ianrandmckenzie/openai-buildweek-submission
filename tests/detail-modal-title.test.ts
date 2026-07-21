import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('calendar detail modals', () => {
  it('render the title once in the modal header without a duplicate blurred title', () => {
    const taskModal = readFileSync('src/lib/components/TaskModal.svelte', 'utf8');
    const eventModal = readFileSync('src/lib/components/EventModal.svelte', 'utf8');

    expect(taskModal).not.toContain('<strong class="detail-title">{task.title}</strong>');
    expect(eventModal).not.toContain('<p class="detail-title obfuscate-target">{event.title}</p>');
  });
});
