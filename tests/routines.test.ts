import { describe, expect, it } from 'vitest';
import { routineIsDue, type Routine } from '../src/lib/routines/routines';
const base: Routine = { id: 'r', project_id: 'p', title: 'Routine', description: '', frequency: 'custom', interval: 1, weekdays: [2], ordinals: [2], blurred: false, archived: false, last_completed_at: null };
describe('routine recurrence', () => {
  it('supports ordinal weekdays such as the second Tuesday', () => { expect(routineIsDue({ ...base, last_completed_at: Date.parse('2026-06-09T12:00:00Z') }, new Date('2026-07-14T12:00:00Z'))).toBe(true); expect(routineIsDue({ ...base, last_completed_at: Date.parse('2026-06-09T12:00:00Z') }, new Date('2026-07-21T12:00:00Z'))).toBe(false); });
  it('supports conventional daily and quarterly intervals', () => { expect(routineIsDue({ ...base, frequency: 'daily', last_completed_at: Date.parse('2026-07-18T12:00:00Z') }, new Date('2026-07-19T12:00:00Z'))).toBe(true); expect(routineIsDue({ ...base, frequency: 'quarterly', last_completed_at: Date.parse('2026-01-01T12:00:00Z') }, new Date('2026-04-01T12:00:00Z'))).toBe(true); });
});
