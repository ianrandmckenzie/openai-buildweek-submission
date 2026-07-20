import { chromium } from '@playwright/test';

const appUrl = process.env.DESKCLERK_APP_URL ?? 'http://127.0.0.1:5173';
const demoPrefix = 'judges-demo-';
const now = Date.now();
const day = 24 * 60 * 60 * 1000;
const id = (name) => `${demoPrefix}${name}`;
const metadata = (name, offset = 0) => ({
  id: id(name),
  created_at: now + offset,
  updated_at: now + offset,
  deleted_at: null,
  synced_at: null,
});

const projectId = id('project');
const taskId = id('task-plan-demo');

const records = {
  projects: [{ ...metadata('project'), name: 'Hackathon Demo', color: '#6d5dfc' }],
  events: [{
    ...metadata('event-launch'), project_id: projectId,
    title: 'DeskClerk demo walkthrough', description: 'A seeded calendar event for the judges.',
    location: 'DeskClerk', starts_at: now + day, ends_at: now + day + 60 * 60 * 1000,
    all_day: false, repeat: 'none', completed: false, source_type: 'manual', read_only: false,
  }],
  tasks: [{
    ...metadata('task-plan-demo', 1), project_id: projectId,
    title: 'Review local-first sync', completed: false, priority: 'high',
    notes: 'Create locally, then sync to the optional backend.',
  }, {
    ...metadata('task-finish-demo', 2), project_id: projectId,
    title: 'Prepare judge questions', completed: true, priority: 'normal', notes: 'Seeded completed task.',
  }],
  notes: [{
    ...metadata('note-welcome', 3), project_id: projectId,
    title: 'Welcome to the demo', content: 'DeskClerk keeps your work local first and syncs to the backend when enabled.',
  }],
  documents: [{
    ...metadata('doc-architecture', 4), project_id: projectId,
    title: 'Demo architecture', content: '# Local-first\n\nThe browser is authoritative offline; the backend provides optional persistence and sync.',
  }],
  time_logs: [{
    ...metadata('time-log-sync', 5), project_id: projectId, task_id: taskId,
    started_at: now - 45 * 60 * 1000, ended_at: now, duration_seconds: 45 * 60,
  }],
  launchpad_links: [{
    ...metadata('link-docs', 6), project_id: projectId,
    title: 'DeskClerk README', url: 'https://github.com/', tags: ['demo', 'docs'],
    description: 'A seeded link for the launchpad.', pinned: true, archived: false, position: 0,
  }],
  settings: [{
    ...metadata('routines-state', 7), key: 'dashboard.routines.v1', value: [{
      id: id('routine-review'), project_id: projectId, title: 'Review the demo workspace',
      description: 'A seeded routine for the judges.', frequency: 'weekly', interval: 1,
      weekdays: [1], ordinals: [], blurred: false, archived: false, last_completed_at: null,
    }],
  }],
};

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
try {
  await page.goto(appUrl, { waitUntil: 'domcontentloaded' });
  await page.evaluate(async ({ records, prefix }) => {
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open('kenzie-deskclerk', 2);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const stores = Object.keys(records);
    await new Promise((resolve, reject) => {
      const tx = db.transaction(stores, 'readwrite');
      for (const storeName of stores) {
        const store = tx.objectStore(storeName);
        store.getAll().onsuccess = (event) => {
          for (const record of event.target.result) {
            if (record.id?.startsWith(prefix)) store.delete(record.id);
          }
        };
        for (const record of records[storeName]) store.put(record);
      }
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  }, { records, prefix: demoPrefix });
  console.log(`Seeded ${Object.values(records).flat().length} demo records into ${appUrl}.`);
} finally {
  await browser.close();
}
