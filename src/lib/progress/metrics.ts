export interface ProgressLog { started_at: number; ended_at?: number; duration_seconds?: number; project_id?: string; }
export interface DailyMetric { date: string; seconds: number; }
export interface ProgressSummary { totalSeconds: number; averageSeconds: number; activeDays: number; daily: DailyMetric[]; }

const MAX_SECONDS_PER_LOG = 24 * 60 * 60;
function dayKey(timestamp: number): string { return new Date(timestamp).toISOString().slice(0, 10); }

export function logDuration(log: ProgressLog): number {
  const duration = log.duration_seconds ?? (log.ended_at !== undefined ? (log.ended_at - log.started_at) / 1000 : 0);
  if (!Number.isFinite(duration) || duration <= 0) return 0;
  return Math.min(duration, MAX_SECONDS_PER_LOG);
}

export function summarizeProgress(logs: ProgressLog[], start: Date, end: Date, projectId?: string): ProgressSummary {
  const startMs = start.getTime(); const endMs = end.getTime(); const byDay = new Map<string, number>();
  for (const log of logs) { if (log.started_at < startMs || log.started_at > endMs || (projectId && log.project_id !== projectId)) continue; const key = dayKey(log.started_at); byDay.set(key, (byDay.get(key) ?? 0) + logDuration(log)); }
  const daily = [...byDay.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, seconds]) => ({ date, seconds })); const totalSeconds = daily.reduce((sum, item) => sum + item.seconds, 0);
  return { totalSeconds, averageSeconds: daily.length ? totalSeconds / daily.length : 0, activeDays: daily.length, daily };
}

export function chartPoints(daily: DailyMetric[], width: number, height: number): string {
  if (!daily.length || width <= 0 || height <= 0) return '';
  const max = Math.max(...daily.map((item) => item.seconds), 1); const xStep = daily.length === 1 ? 0 : width / (daily.length - 1);
  return daily.map((item, index) => `${(index * xStep).toFixed(2)},${(height - (item.seconds / max) * height).toFixed(2)}`).join(' ');
}

export function formatDuration(seconds: number): string { const safe = Math.max(0, Math.round(seconds)); const hours = Math.floor(safe / 3600); const minutes = Math.floor((safe % 3600) / 60); return hours ? `${hours}h ${minutes}m` : `${minutes}m`; }
