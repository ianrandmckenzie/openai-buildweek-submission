import { describe, expect, it } from 'vitest';
import { filterCalendarItems, monthLabel, monthMatrix, populateMonth, type CalendarItem } from '../src/lib/calendar/calendar';

describe('calendar utilities', () => {
  it('builds a stable six-week matrix with correct leap-day placement', () => { const days = monthMatrix(2024, 1); expect(days).toHaveLength(42); expect(days.find((day) => day.isoDate === '2024-02-29')?.day).toBe(29); expect(days.filter((day) => day.inMonth)).toHaveLength(29); });
  it('supports Monday-starting calendars and month labels', () => { expect(monthMatrix(2023, 9, 1)[0].isoDate).toBe('2023-09-25'); expect(monthLabel(2023, 9)).toBe('October 2023'); });
  it('filters by project and populates items by local calendar date', () => { const items: CalendarItem[] = [{ id: 'a', project_id: 'p1', title: 'One', starts_at: Date.parse('2024-02-29T10:00:00Z') }, { id: 'b', project_id: 'p2', title: 'Two', starts_at: Date.parse('2024-02-29T12:00:00Z') }]; const days = populateMonth(monthMatrix(2024, 1), filterCalendarItems(items, 'p1')); expect(days.find((day) => day.isoDate === '2024-02-29')?.items.map((item) => item.id)).toEqual(['a']); expect(filterCalendarItems(items)).toHaveLength(2); });
});
