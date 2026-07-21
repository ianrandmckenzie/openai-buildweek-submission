import { beforeAll, describe, expect, it } from 'vitest';
import { generateExampleData } from '../src/lib/settings/example-data';
import { resetDatabase, Storage } from '../src/lib/storage/idb';
import { clearJsonState, readJsonState } from '../src/lib/storage/json-state';

describe('example workspace generator', () => {
  beforeAll(async () => { await resetDatabase(); clearJsonState('dashboard.routines.v1'); clearJsonState('dashboard.time-logs.v1'); });

  it('creates a coherent lived-in roofing and web-design workspace', async () => {
    await generateExampleData(1_000_000);
    const storage = new Storage();
    const projects = await storage.list('projects');
    expect(projects.map((project) => project.name)).toEqual(expect.arrayContaining(['Cascade Roofing Co.', 'Side Door Web Design']));
    expect((await storage.list('events')).some((event) => event.project_id === projects.find((project) => project.name === 'Cascade Roofing Co.')?.id)).toBe(true);
    expect((await storage.list('launchpad_links')).some((link) => link.tags.includes('design'))).toBe(true);
    expect(readJsonState<any[]>('dashboard.routines.v1', [])).toHaveLength(2);
  });

  it('is safe to run again without duplicating example records', async () => {
    await generateExampleData(1_000_000);
    await generateExampleData(2_000_000);
    expect((await new Storage().list('projects')).filter((project) => project.id.startsWith('example-space-'))).toHaveLength(2);
  });

  it('creates visible time logs for both example projects', async () => {
    await generateExampleData(1_000_000);
    const logs = readJsonState<any[]>('dashboard.time-logs.v1', []);
    expect(logs.filter((log) => log.project_id === 'example-space-roofing')).toHaveLength(16);
    expect(logs.filter((log) => log.project_id === 'example-space-studio')).toHaveLength(11);
  });
});
