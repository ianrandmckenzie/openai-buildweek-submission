import { describe, expect, it } from 'vitest';
import { eventFromDraft, validateEventDraft, type EventDraft } from '../src/lib/calendar/events';

const draft: EventDraft = { project_id: 'p1', title: 'Build review', description: 'Discuss progress', location: 'Room 1', starts_at: '2026-07-18T09:00', ends_at: '2026-07-18T10:00', all_day: false, source_type: 'manual', read_only: false };
describe('calendar event modal flow', () => {
  it('validates and creates an event from the shared draft', () => { expect(validateEventDraft(draft)).toBeUndefined(); expect(eventFromDraft(draft, 'event-1')).toMatchObject({ id: 'event-1', title: 'Build review', project_id: 'p1', source_type: 'manual', read_only: false }); });
  it('rejects missing titles and backwards date ranges', () => { expect(validateEventDraft({ ...draft, title: '' })).toBe('Title is required'); expect(validateEventDraft({ ...draft, ends_at: '2026-07-18T08:00' })).toContain('End date'); });
  it('does not allow editing read-only external events at the modal boundary', () => { const external = eventFromDraft({ ...draft, source_type: 'ics', read_only: true }, 'external'); expect(external.read_only).toBe(true); });
});
