export interface CalendarItem {
  id: string;
  project_id: string;
  title: string;
  starts_at: number;
  ends_at?: number;
  kind?: 'event' | 'task' | 'log';
  description?: string;
  location?: string;
  all_day?: boolean;
  read_only?: boolean;
  completed?: boolean;
  blurred?: boolean;
}

export interface CalendarDay {
  date: Date;
  isoDate: string;
  day: number;
  inMonth: boolean;
  items: CalendarItem[];
}

function dateKey(date: Date): string {
  return Number.isFinite(date.getTime()) ? date.toISOString().slice(0, 10) : '';
}

export function monthMatrix(year: number, month: number, weekStartsOn = 0): CalendarDay[] {
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 0 || month > 11) throw new Error('Invalid calendar month');
  const first = new Date(year, month, 1);
  const offset = (first.getDay() - weekStartsOn + 7) % 7;
  const start = new Date(year, month, 1 - offset);
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + index);
    return { date, isoDate: dateKey(date), day: date.getDate(), inMonth: date.getMonth() === month, items: [] };
  });
}

export function filterCalendarItems(items: CalendarItem[], projectId?: string): CalendarItem[] {
  return items.filter((item) => !projectId || item.project_id === projectId);
}

export function populateMonth(days: CalendarDay[], items: CalendarItem[]): CalendarDay[] {
  const byDate = new Map<string, CalendarItem[]>();
  for (const item of items) {
    const key = dateKey(new Date(item.starts_at));
    if (!key) continue;
    const existing = byDate.get(key) ?? [];
    existing.push(item);
    byDate.set(key, existing);
  }
  return days.map((day) => ({ ...day, items: byDate.get(day.isoDate) ?? [] }));
}

export function monthLabel(year: number, month: number, locale = 'en-US'): string { return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(new Date(year, month, 1)); }
