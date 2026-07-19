import type { RecordByStore, StoreName } from '../storage/models';

export interface SearchResult { type: string; title: string; text: string; }
const mappings: Array<[StoreName, string, (value: any) => { title: string; text: string }]> = [
  ['tasks', 'Task', (value) => ({ title: value.title, text: value.notes ?? '' })],
  ['events', 'Event', (value) => ({ title: value.title, text: `${value.description ?? ''} ${value.location ?? ''}` })],
  ['notes', 'Quicknote / Doc', (value) => ({ title: value.title, text: value.content ?? '' })],
  ['documents', 'Doc', (value) => ({ title: value.title, text: value.content ?? '' })],
  ['launchpad_links', 'Launchpad', (value) => ({ title: value.title, text: `${value.url} ${(value.tags ?? []).join(' ')}` })],
  ['time_logs', 'Time log', (value) => ({ title: value.task_id ?? 'Time log', text: `${value.started_at} ${value.ended_at ?? ''}` })]
];
export function searchRecords(records: Partial<Record<StoreName, RecordByStore[StoreName][]>>, query: string): SearchResult[] {
  const normalized = query.trim().toLowerCase();
  return mappings.flatMap(([store, type, map]) => (records[store] ?? []).filter((value) => value.deleted_at === null).map((value) => ({ type, ...map(value) }))).filter((result) => `${result.title} ${result.text}`.toLowerCase().includes(normalized));
}
