import { test, expect } from '@playwright/test';

test('pairs the device, persists backend settings, and pushes a local note', async ({ page }) => {
  const pushes: unknown[] = [];
  await page.route('**/health', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: { status: 'ok', database: true } }) }));
  await page.route('**/api/v1/devices/pair', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: { device_id: 'e2e-device', device_token: 'e2e-token' } }) }));
  await page.route('**/api/v1/sync/push', async (route) => { pushes.push(route.request().postDataJSON()); await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: { version: 1, cursor: 1, accepted: ['e2e-note'], rejected: [], conflicts: [] } }) }); });
  await page.goto('/');
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('button', { name: 'Backend' }).click();
  await page.getByRole('checkbox', { name: /Enable remote persistence/ }).check();
  await page.getByRole('button', { name: 'Pair device' }).click();
  await page.getByRole('textbox', { name: 'Pairing code' }).fill('E2E12345');
  await page.getByRole('button', { name: 'Pair device' }).click();
  await expect(page.getByText(/Device paired/)).toBeVisible();
  await page.getByRole('button', { name: 'Save settings' }).first().click();
  await expect(page.getByRole('checkbox', { name: /Enable remote persistence/ })).toBeChecked();
  await page.getByRole('button', { name: 'Close settings' }).click();
  await page.getByRole('button', { name: 'Quicknotes' }).click();
  await page.getByRole('textbox', { name: 'New note title' }).fill('E2E synced note');
  await page.getByRole('textbox', { name: 'New note body' }).fill('Created locally first');
  await page.getByRole('button', { name: 'Add note' }).click();
  await expect.poll(() => pushes.length).toBe(1);
  expect((pushes[0] as { records: Array<{ id: string; store: string }> }).records[0].store).toBe('notes');
});
