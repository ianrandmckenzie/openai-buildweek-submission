import { describe, expect, it, vi } from 'vitest';
import { parseIcsFeed } from '../src/lib/integrations/ics';
import { createGoogleOAuthBridge, googleAuthorizationUrl } from '../src/lib/integrations/google';

const feed = 'BEGIN:VCALENDAR\nBEGIN:VEVENT\nUID:event-1\nDTSTART;TZID=America/Los_Angeles:20240704T090000\nDTEND;TZID=America/Los_Angeles:20240704T100000\nSUMMARY:Build Week\\, kickoff\nEND:VEVENT\nBEGIN:VEVENT\nUID:event-2\nDTSTART:20240705T120000Z\nSUMMARY:UTC event\nEND:VEVENT\nEND:VCALENDAR';
describe('calendar integrations', () => {
  it('parses read-only ICS events with source metadata and folded-safe values', () => { const events = parseIcsFeed(feed, 'https://calendar.example/feed.ics'); expect(events).toHaveLength(2); expect(events[0]).toMatchObject({ id: 'event-1', title: 'Build Week, kickoff', source_type: 'ics', source_url: 'https://calendar.example/feed.ics', read_only: true, timezone: 'America/Los_Angeles' }); expect(events[1].starts_at).toBe(Date.parse('2024-07-05T12:00:00Z')); });
  it('skips incomplete events and rejects unsupported dates', () => { expect(parseIcsFeed('BEGIN:VEVENT\nUID:x\nEND:VEVENT', 'x')).toEqual([]); expect(() => parseIcsFeed('BEGIN:VEVENT\nUID:x\nDTSTART:bad\nSUMMARY:X\nEND:VEVENT', 'x')).toThrow(); });
  it('builds a safe Google OAuth URL and bridges external opening', async () => { const url = googleAuthorizationUrl({ clientId: 'client', redirectUri: 'http://localhost/callback' }, 'state'); expect(url).toContain('accounts.google.com'); const open = vi.fn().mockResolvedValue(undefined); await createGoogleOAuthBridge(open).authorize(url); expect(open).toHaveBeenCalledWith(url); await expect(createGoogleOAuthBridge().authorize('http://unsafe.test')).rejects.toThrow('HTTPS'); });
});
