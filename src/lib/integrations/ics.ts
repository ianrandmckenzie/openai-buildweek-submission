export interface ExternalCalendarEvent { id: string; title: string; starts_at: number; ends_at?: number; source_type: 'ics'; source_url: string; read_only: true; timezone?: string; }

function unfold(value: string): string[] { return value.replace(/\r?\n[ \t]/g, '').split(/\r?\n/); }
function parseDate(value: string, timezone?: string): number {
  const clean = value.replace(/^VALUE=DATE:/, '');
  if (/^\d{8}$/.test(clean)) return Date.UTC(Number(clean.slice(0, 4)), Number(clean.slice(4, 6)) - 1, Number(clean.slice(6, 8)));
  const match = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/.exec(clean); if (!match) throw new Error(`Unsupported ICS date: ${value}`);
  const [, year, month, day, hour, minute, second, utc] = match; const iso = `${year}-${month}-${day}T${hour}:${minute}:${second}${utc ? 'Z' : ''}`;
  const timestamp = Date.parse(iso); if (Number.isNaN(timestamp)) throw new Error(`Invalid ICS date: ${value}`); return timestamp;
}

export function parseIcsFeed(input: string, sourceUrl: string): ExternalCalendarEvent[] {
  const lines = unfold(input); const events: ExternalCalendarEvent[] = []; let current: Record<string, string> | undefined;
  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') { current = {}; continue; }
    if (line === 'END:VEVENT') {
      if (!current?.UID || !current.DTSTART || !current.SUMMARY) continue;
      const starts = current.DTSTART_VALUE ? parseDate(current.DTSTART_VALUE, current.DTSTART_TZID) : 0; const ends = current.DTEND_VALUE ? parseDate(current.DTEND_VALUE, current.DTEND_TZID) : undefined;
      events.push({ id: current.UID, title: current.SUMMARY, starts_at: starts, ...(ends ? { ends_at: ends } : {}), source_type: 'ics', source_url: sourceUrl, read_only: true, ...(current.DTSTART_TZID ? { timezone: current.DTSTART_TZID } : {}) }); current = undefined; continue;
    }
    if (!current) continue; const separator = line.indexOf(':'); if (separator < 0) continue; const rawKey = line.slice(0, separator); const value = line.slice(separator + 1).replace(/\\n/g, '\n').replace(/\\,/g, ','); const [key, ...parameters] = rawKey.split(';'); const tzid = parameters.find((parameter) => parameter.startsWith('TZID='))?.slice(5); current[key] = value; if (key === 'DTSTART' || key === 'DTEND') { current[`${key}_VALUE`] = value; if (tzid) current[`${key}_TZID`] = tzid; }
  }
  return events;
}
