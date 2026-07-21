import { expect, test, type Page } from '@playwright/test';

async function seedCalendarData(page: Page): Promise<void> {
  await page.evaluate(() => new Promise<void>((resolve, reject) => {
    const request = indexedDB.open('kenzie-deskclerk', 2);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const now = Date.now();
      const project = { id: 'default-project', name: 'E2E Project', created_at: now, updated_at: now, deleted_at: null, synced_at: null };
      const task = { id: 'e2e-task', project_id: project.id, title: 'E2E Task', completed: false, due_at: now, created_at: now, updated_at: now, deleted_at: null, synced_at: null };
      const event = { id: 'e2e-event', project_id: project.id, title: 'E2E Event', starts_at: now, ends_at: now + 60 * 60 * 1000, all_day: false, repeat: 'none', completed: false, created_at: now, updated_at: now, deleted_at: null, synced_at: null };
      const tx = db.transaction(['projects', 'tasks', 'events'], 'readwrite');
      tx.objectStore('projects').put(project); tx.objectStore('tasks').put(task); tx.objectStore('events').put(event);
      tx.oncomplete = () => { db.close(); resolve(); }; tx.onerror = () => reject(tx.error);
    };
  }));
}

test.describe('Calendar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await seedCalendarData(page);
    await page.reload();
    await page.getByRole('button', { name: 'Calendar' }).click();
  });

  test('shows day actions on hover', async ({ page }) => {
    const day = page.locator('.calendar-cell').filter({ has: page.getByRole('button', { name: /Create task on/ }) }).first();
    await day.hover();
    await expect(day.getByRole('button', { name: /Create task on/ })).toBeVisible();
    await expect(day.getByRole('button', { name: /Create event on/ })).toBeVisible();
  });

  test('opens task creation from the day checkbox', async ({ page }) => {
    await page.getByRole('button', { name: /Create task on/ }).first().click();
    await expect(page.getByRole('heading', { name: 'Add Task' })).toBeVisible();
  });

  test('opens event creation from the day plus button', async ({ page }) => {
    await page.getByRole('button', { name: /Create event on/ }).first().click();
    await expect(page.getByRole('heading', { name: 'Add Event' })).toBeVisible();
  });

  test('has a project scope toggle', async ({ page }) => {
    await expect(page.getByRole('group', { name: 'Project scope' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'This project' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'All projects' })).toBeVisible();
  });

  test('all-projects scope shows records across projects', async ({ page }) => {
    await page.getByRole('button', { name: 'All projects' }).click();
    await expect(page.getByText('All projects').last()).toBeVisible();
  });

  test('this-project scope shows only the active project', async ({ page }) => {
    await page.getByRole('button', { name: /Project / }).first().click();
    await page.getByRole('button', { name: 'This project' }).click();
    await expect(page.getByText('This project').last()).toBeVisible();
  });

  test('opens the clicked calendar card details', async ({ page }) => {
    const card = page.getByRole('button', { name: 'E2E Task' });
    await card.click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('Play starts a time log at click time', async ({ page }) => {
    const card = page.getByRole('button', { name: 'E2E Task' });
    await card.click();
    await page.getByRole('button', { name: 'Play' }).click();
    await expect(page.getByText('Time Logs')).toBeVisible();
  });

  test('task time logs keep the task title', async ({ page }) => {
    const card = page.getByRole('button', { name: 'E2E Task' });
    const title = await card.innerText();
    await card.click(); await page.getByRole('button', { name: 'Play' }).click();
    await expect(page.getByText(title).last()).toBeVisible();
  });

  test('completing a timed event creates a matching log', async ({ page }) => {
    const event = page.locator('.calendar-item').filter({ has: page.locator('input[type="checkbox"]:not(:disabled)') }).first();
    const title = await event.getByRole('button', { name: 'E2E Event' }).innerText();
    await event.locator('input[type="checkbox"]').check();
    await expect(page.getByText(title).last()).toBeVisible();
  });

  test('deleting a record removes it from storage and the calendar', async ({ page }) => {
    const card = page.getByRole('button', { name: 'E2E Task' });
    const title = await card.innerText(); await card.click(); await page.getByRole('button', { name: 'Delete' }).click();
    await expect(page.locator('.calendar-item button', { hasText: title })).toHaveCount(0);
  });
});
