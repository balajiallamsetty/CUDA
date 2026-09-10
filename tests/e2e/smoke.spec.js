import { test, expect } from '@playwright/test';

test('home page renders hero and navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Building technology, experiences and connections that move people forward.',
  );
  await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Start a Project' }).first()).toBeVisible();
});

test('contact page renders form', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.getByLabel('Name')).toBeVisible();
  await expect(page.getByLabel('Message')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Send message' })).toBeVisible();
});
