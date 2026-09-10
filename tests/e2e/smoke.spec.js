import { test, expect } from '@playwright/test';

test('home page renders hero and navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Building technology, experiences and connections that move people forward.',
  );
  await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
});

test('user can open web services and start project form', async ({ page }) => {
  await page.goto('/solutions/web-services');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.goto('/start-project');
  await expect(page.getByLabel('Name')).toBeVisible();
  await expect(page.getByLabel('Service')).toBeVisible();
});

test('contact page renders form', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.getByLabel('Name')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Send message' })).toBeVisible();
});

test('unauthorized admin access redirects to login', async ({ page }) => {
  await page.goto('/admin/dashboard');
  await expect(page).toHaveURL(/\/admin\/login/);
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
});

test('portfolio and talks pages render', async ({ page }) => {
  await page.goto('/portfolio');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Selected projects');
  await page.goto('/talks');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Conversations');
});
