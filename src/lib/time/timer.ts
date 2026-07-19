import { writable, get, type Readable } from 'svelte/store';

export interface ActiveTimer { taskId: string; startedAt: number; elapsedSeconds: number; }
export interface TimerClock { now(): number; setInterval(callback: () => void, ms: number): unknown; clearInterval(handle: unknown): void; }

const browserClock: TimerClock = { now: () => Date.now(), setInterval: (callback, ms) => globalThis.setInterval(callback, ms), clearInterval: (handle) => globalThis.clearInterval(handle as ReturnType<typeof setInterval>) };

export class TaskTimer {
  readonly active: Readable<ActiveTimer | null>;
  private readonly activeStore = writable<ActiveTimer | null>(null);
  private interval: unknown;
  constructor(private readonly clock: TimerClock = browserClock) { this.active = { subscribe: this.activeStore.subscribe }; }

  start(taskId: string, startedAt = this.clock.now()): ActiveTimer {
    if (!taskId.trim()) throw new Error('A task id is required');
    this.stop(); const timer = { taskId, startedAt, elapsedSeconds: 0 }; this.activeStore.set(timer); this.interval = this.clock.setInterval(() => this.tick(), 1000); return timer;
  }
  stop(endedAt = this.clock.now()): { taskId: string; startedAt: number; endedAt: number; duration_seconds: number } | undefined {
    const current = get(this.activeStore); if (!current) return undefined;
    const result = { taskId: current.taskId, startedAt: current.startedAt, endedAt, duration_seconds: Math.max(0, Math.floor((endedAt - current.startedAt) / 1000)) }; if (this.interval !== undefined) this.clock.clearInterval(this.interval); this.interval = undefined; this.activeStore.set(null); return result;
  }
  destroy(): void { this.stop(); }
  private tick(): void { this.activeStore.update((current) => current ? { ...current, elapsedSeconds: Math.max(0, Math.floor((this.clock.now() - current.startedAt) / 1000)) } : current); }
}

export function formatTimer(seconds: number): string { const safe = Math.max(0, Math.floor(seconds)); return `${String(Math.floor(safe / 3600)).padStart(2, '0')}:${String(Math.floor((safe % 3600) / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`; }
