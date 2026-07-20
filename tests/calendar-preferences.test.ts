import { describe, expect, it } from 'vitest';
import { visibleWeekdayIndexes } from '../src/lib/calendar/preferences';

describe('calendar preferences', () => {
  it('orders weekdays from the configured start day', () => { expect(visibleWeekdayIndexes({ weekStartsOn: 1, displayedDays: 'full-week' })).toEqual([1, 2, 3, 4, 5, 6, 0]); });
  it('removes weekends when weekdays-only is selected', () => { expect(visibleWeekdayIndexes({ weekStartsOn: 0, displayedDays: 'weekdays' })).toEqual([1, 2, 3, 4, 5]); });
});
