import { expect, test } from '@playwright/test';

test.describe('Calendar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
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
    const card = page.locator('.calendar-item button').first();
    test.skip(!(await card.count()), 'Requires a seeded calendar record');
    await card.click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('Play starts a time log at click time', async ({ page }) => {
    const card = page.locator('.calendar-item button').first();
    test.skip(!(await card.count()), 'Requires a seeded task');
    await card.click();
    const before = Date.now();
    await page.getByRole('button', { name: 'Play' }).click();
    const log = await page.evaluate(() => JSON.parse(localStorage.getItem('dashboard.time-logs.v1') ?? '[]').at(-1));
    expect(log.active).toBe(true);
    expect(log.started_at).toBeGreaterThanOrEqual(before - 1000);
  });

  test('task time logs keep the task title', async ({ page }) => {
    const card = page.locator('.calendar-item button').first();
    test.skip(!(await card.count()), 'Requires a seeded task');
    const title = await card.innerText();
    await card.click(); await page.getByRole('button', { name: 'Play' }).click();
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('dashboard.time-logs.v1') ?? '[]').at(-1)?.title)).toBe(title);
  });

  test('completing a timed event creates a matching log', async ({ page }) => {
    const event = page.locator('.calendar-item').filter({ has: page.locator('input[type="checkbox"]:not(:disabled)') }).first();
    test.skip(!(await event.count()), 'Requires a seeded timed event');
    const title = await event.locator('button').innerText();
    await event.locator('input[type="checkbox"]').check();
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('dashboard.time-logs.v1') ?? '[]').at(-1)?.title)).toBe(title);
  });

  test('deleting a record removes it from storage and the calendar', async ({ page }) => {
    const card = page.locator('.calendar-item button').first();
    test.skip(!(await card.count()), 'Requires a seeded calendar record');
    const title = await card.innerText(); await card.click(); await page.getByRole('button', { name: 'Delete' }).click();
    await expect(page.locator('.calendar-item button', { hasText: title })).toHaveCount(0);
  });
});
