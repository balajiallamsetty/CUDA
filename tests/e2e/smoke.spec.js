import { test, expect } from '@playwright/test';

test('home page renders Project Assistance hero and navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Vignak Solutions').first()).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Turn your project idea into a working technical project.',
  );
  await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Project Assistance' }).first()).toBeVisible();
});

test('project assistance page and register path render', async ({ page }) => {
  await page.goto('/project-assistance');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Technical help for academic projects');
  await page.goto('/register');
  await expect(page.getByRole('heading', { name: /create your student account/i })).toBeVisible();
  await expect(page.getByLabel('Full name')).toBeVisible();
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();
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
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Project directions');
  await page.goto('/talks');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Conversations');
});
