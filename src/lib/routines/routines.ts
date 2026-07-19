export type RoutineFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'custom';
export interface Routine { id: string; project_id: string; title: string; description: string; frequency: RoutineFrequency; interval: number; weekdays: number[]; ordinals: number[]; blurred: boolean; archived: boolean; last_completed_at: number | null; }
export function routineIsDue(routine: Routine, date = new Date()): boolean {
  if (routine.last_completed_at === null) return true;
  const last = new Date(routine.last_completed_at); const day = 86400000;
  if (routine.frequency === 'daily') return date.getTime() - last.getTime() >= routine.interval * day;
  if (routine.frequency === 'weekly') return date.getTime() - last.getTime() >= routine.interval * 7 * day;
  if (routine.frequency === 'quarterly') return date.getMonth() - last.getMonth() + (date.getFullYear() - last.getFullYear()) * 12 >= routine.interval * 3;
  if (routine.frequency === 'monthly') return date.getMonth() !== last.getMonth() || date.getFullYear() !== last.getFullYear();
  if (!routine.weekdays.includes(date.getDay())) return false;
  const ordinal = Math.floor((date.getDate() - 1) / 7) + 1;
  return routine.ordinals.includes(ordinal) && (date.getMonth() !== last.getMonth() || date.getFullYear() !== last.getFullYear());
}
export function routineLabel(routine: Routine): string { if (routine.frequency === 'custom') return `Custom: ${routine.ordinals.join(' & ')}${routine.ordinals.length === 1 ? 'th' : 'th'} weekday`; return routine.frequency[0].toUpperCase() + routine.frequency.slice(1); }
