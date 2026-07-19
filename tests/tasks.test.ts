import { describe, expect, it } from 'vitest';
import { taskFromDraft, taskDurationIsUnderDay, timeLogFromEvent } from '../src/lib/calendar/tasks';
describe('calendar task workflows', () => {
  it('creates tasks and rejects missing titles', () => { expect(taskFromDraft({ title: 'Write report', due_at: '2026-07-19T09:00', project_id: 'p1' }, 't1')).toMatchObject({ id: 't1', completed: false }); expect(() => taskFromDraft({ title: '', due_at: '2026-07-19T09:00', project_id: 'p1' })).toThrow('title'); });
  it('limits event completion logging to events shorter than 24 hours', () => { expect(taskDurationIsUnderDay(0, 60 * 60 * 1000)).toBe(true); expect(taskDurationIsUnderDay(0, 24 * 60 * 60 * 1000)).toBe(false); });
  it('creates a time-log payload from a completed event', () => { expect(timeLogFromEvent({ id: 'e1', project_id: 'p1', starts_at: 0, ends_at: 3600000 })).toMatchObject({ task_id: 'e1', duration_seconds: 3600 }); });
});
