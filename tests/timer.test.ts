import { describe, expect, it } from 'vitest';
import { TaskTimer, formatTimer, type TimerClock } from '../src/lib/time/timer';

function fakeClock(): TimerClock & { nowValue: number; tick: () => void } { let callback: () => void = () => {}; const clock = { nowValue: 1000, now() { return this.nowValue; }, setInterval(next: () => void) { callback = next; return 1; }, clearInterval() { callback = () => {}; }, tick() { callback(); } }; return clock; }

describe('task timer', () => {
  it('tracks elapsed time and emits a completed log', () => { const clock = fakeClock(); const timer = new TaskTimer(clock); timer.start('task-1', 1000); clock.nowValue = 5500; clock.tick(); let active: any; const unsubscribe = timer.active.subscribe((value) => { active = value; }); expect(active.elapsedSeconds).toBe(4); const log = timer.stop(6500); expect(log).toMatchObject({ taskId: 'task-1', startedAt: 1000, endedAt: 6500, duration_seconds: 5 }); unsubscribe(); });
  it('replaces an existing timer and rejects blank tasks', () => { const clock = fakeClock(); const timer = new TaskTimer(clock); expect(() => timer.start('')).toThrow(); timer.start('one', 1000); timer.start('two', 2000); const log = timer.stop(3000); expect(log?.taskId).toBe('two'); });
  it('formats long and short durations', () => { expect(formatTimer(0)).toBe('00:00:00'); expect(formatTimer(3661)).toBe('01:01:01'); });
});
