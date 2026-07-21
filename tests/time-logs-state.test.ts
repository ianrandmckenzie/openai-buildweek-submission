import { beforeEach, describe, expect, it, vi } from 'vitest';
import { get } from 'svelte/store';
import { activeTimeLog, deleteTimeLog, groupedTimeLogs, logFromCalendarEvent, pauseTimer, reloadTimeLogs, resumeTimer, startTimer, stopTimer, timeLogs, toggleBlur, update } from '../src/lib/time/state';
import { searchRecords } from '../src/lib/search/index';
import { clearJsonState, writeJsonState } from '../src/lib/storage/json-state';

const sample = (overrides: Record<string, unknown> = {}) => ({ id: 'a', group_id: 'g', project_id: 'p1', title: 'Write report', description: 'Draft the report', started_at: 1000, ended_at: 2000, duration_seconds: 1, active: false, paused: false, blurred: false, ...overrides });

describe('time log expectations', () => {
  beforeEach(() => { clearJsonState('dashboard.time-logs.v1'); timeLogs.set([]); vi.useRealTimers(); });

  it('starts a log in the selected project and persists its description', () => {
    const log = startTimer('Write report', 'Draft the report', 'project-1');
    expect(log).toMatchObject({ title: 'Write report', description: 'Draft the report', project_id: 'project-1', active: true });
    expect(get(timeLogs)).toHaveLength(1);
  });

  it('treats the start form value as the title and leaves description blank', () => {
    const log = startTimer('Plan sprint', '', 'project-1'); expect(log.title).toBe('Plan sprint'); expect(log.description).toBe('');
  });

  it('pauses and stops the active timer', () => {
    vi.useFakeTimers(); vi.setSystemTime(1000); startTimer('Work', 'Details', 'p'); vi.setSystemTime(5000); pauseTimer();
    let active = null; const unsubscribe = activeTimeLog.subscribe((value) => active = value); expect(active).toBeUndefined(); unsubscribe();
    const paused = get(timeLogs)[0]; expect(paused.paused).toBe(true); expect(paused.duration_seconds).toBe(4);
    vi.setSystemTime(6000); startTimer('Work', 'Details', 'p'); vi.setSystemTime(7000); stopTimer();
    const stopped = get(timeLogs); expect(stopped.at(-1)?.active).toBe(false); expect(stopped.at(-1)?.paused).toBe(false);
  });

  it('finalizes the previous entry before starting another timer', () => {
    vi.useFakeTimers(); vi.setSystemTime(10_000);
    startTimer('First', '', 'p1');
    vi.setSystemTime(15_500);
    startTimer('Second', '', 'p1');
    const logs = get(timeLogs);
    expect(logs[0]).toMatchObject({ active: false, paused: true, ended_at: 15_500, duration_seconds: 5 });
    expect(logs[1]).toMatchObject({ active: true, title: 'Second' });
  });

  it('groups resumed entries and exposes the active child', () => {
    timeLogs.set([sample({ id: 'a', active: false }), sample({ id: 'b', group_id: 'g', active: true, ended_at: null }) as never]);
    let groups: any[] = []; const unsubscribe = groupedTimeLogs.subscribe((value) => groups = value); expect(groups).toHaveLength(1); expect(groups[0].entries).toHaveLength(2); expect(groups[0].entries.some((entry: any) => entry.active)).toBe(true); unsubscribe();
  });

  it('reports cumulative group time and blurs every child together', () => {
    timeLogs.set([sample({ id: 'a', duration_seconds: 10 }), sample({ id: 'b', duration_seconds: 20, group_id: 'g', active: true, ended_at: null }) as never]);
    let active: any; const stop = activeTimeLog.subscribe((value) => active = value); expect(active.duration_seconds).toBe(30); stop(); toggleBlur('a');
    let logs: any[] = []; const unsubscribe = timeLogs.subscribe((value) => logs = value); expect(logs.every((log) => log.blurred)).toBe(true); unsubscribe();
  });

  it('creates a completed persisted log from a checked calendar event', () => {
    const log = logFromCalendarEvent({ id: 'event-1', project_id: 'project-1', title: 'Planning', description: 'Roadmap', starts_at: 1000, ends_at: 61_000 });
    expect(log).toMatchObject({ group_id: 'event-1', title: 'Planning', description: 'Roadmap', duration_seconds: 60, active: false });
    expect(get(timeLogs)[0].ended_at).toBe(61_000);
  });

  it('supports edit, delete, and blur actions', () => {
    timeLogs.set([sample() as never]); update(sample({ title: 'Updated' }) as never); toggleBlur('a');
    expect(get(timeLogs)[0]).toMatchObject({ title: 'Updated', blurred: true }); deleteTimeLog('a'); expect(timeLogs).toBeTruthy();
  });

  it('makes time logs searchable in the Search sidebar data model', () => {
    const result = searchRecords({ time_logs: [{ ...sample(), deleted_at: null } as never] }, 'draft'); expect(result[0]).toMatchObject({ type: 'Time log', title: 'Write report' }); expect(result[0].text).toContain('Draft the report');
  });

  it('reloads newly generated logs into the mounted time-log view', async () => {
    writeJsonState('dashboard.time-logs.v1', [sample({ id: 'generated', project_id: 'project-1' })]);
    await reloadTimeLogs();
    expect(get(timeLogs).map((log) => log.id)).toEqual(['generated']);
  });
});
