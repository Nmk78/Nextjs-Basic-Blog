import { test, expect } from '@playwright/test';

test.describe('Public Routes', () => {
  test('should access home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/NextJS Starter/);
    await expect(page.locator('h1')).toContainText('NextJS Starter');
  });

  test('should access sign-in page', async ({ page }) => {
    await page.goto('/sign-in');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('should access sign-up page', async ({ page }) => {
    await page.goto('/sign-up');
    await expect(page.getByRole('heading', { name: 'Create an account' })).toBeVisible();
  });
});

test.describe('Protected Routes', () => {
  test('should redirect unauthenticated users from dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/sign-in/);
  });

  test('should redirect unauthenticated users from settings', async ({ page }) => {
    await page.goto('/settings');
    await expect(page).toHaveURL(/sign-in/);
  });

  test('should redirect unauthenticated users from api-keys', async ({ page }) => {
    await page.goto('/settings/api-keys');
    await expect(page).toHaveURL(/sign-in/);
  });
});

test.describe('Authentication Flow', () => {
  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/sign-in');
    await page.getByRole('button', { name: 'Use Password Login' }).click();
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.locator('[data-state="open"]')).toBeVisible();
  });
});
