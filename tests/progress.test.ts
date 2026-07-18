import { describe, expect, it } from 'vitest';
import { chartPoints, formatDuration, logDuration, summarizeProgress } from '../src/lib/progress/metrics';

describe('progress metrics', () => {
  it('handles empty history safely', () => { const summary = summarizeProgress([], new Date('2024-01-01'), new Date('2024-01-31')); expect(summary).toEqual({ totalSeconds: 0, averageSeconds: 0, activeDays: 0, daily: [] }); expect(chartPoints([], 720, 220)).toBe(''); });
  it('aggregates selected dates and projects while bounding outliers', () => { const logs = [{ started_at: Date.parse('2024-01-02T10:00:00Z'), duration_seconds: 3600, project_id: 'p1' }, { started_at: Date.parse('2024-01-02T12:00:00Z'), duration_seconds: 999999, project_id: 'p1' }, { started_at: Date.parse('2024-01-03T12:00:00Z'), ended_at: Date.parse('2024-01-03T13:30:00Z'), project_id: 'p2' }]; const summary = summarizeProgress(logs, new Date('2024-01-01'), new Date('2024-01-05'), 'p1'); expect(summary.totalSeconds).toBe(90000); expect(summary.activeDays).toBe(1); expect(logDuration(logs[1])).toBe(86400); });
  it('generates bounded SVG points and readable durations', () => { const points = chartPoints([{ date: 'a', seconds: 0 }, { date: 'b', seconds: 60 }], 720, 220); expect(points).toContain('0.00,220.00'); expect(points).toContain('720.00,0.00'); expect(formatDuration(3660)).toBe('1h 1m'); });
});
