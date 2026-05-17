import { test, expect } from '@playwright/test';


test('successful login', async ({ page }) => {
  await page.goto('/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  await expect(page).toHaveURL(/inventory/);
});


test('failed login', async ({ page }) => {
  await page.goto('/');
  await page.fill('#user-name', 'abcedefew');
  await page.fill('#password', 'fewfewdfsa');
  await page.click('#login-button');
  await expect(page.locator('[data-test="error"]')).toBeVisible();
});

test('empty username', async ({ page }) => {
  await page.goto('/');
  await page.click('#login-button');
  await expect(page.locator('[data-test="error"]')).toBeVisible();
  await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Username is required');
});


test('empty password', async ({ page }) => {
  await page.goto('/');
  await page.fill('#user-name', 'abcedefew');
  await page.click('#login-button');
  await expect(page.locator('[data-test="error"]')).toBeVisible();
  await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Password is required');
});

test('locked out user', async ({ page }) => {
  await page.goto('/');
  await page.fill('#user-name', 'locked_out_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  await expect(page.locator('[data-test="error"]')).toBeVisible();
  await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Sorry, this user has been locked out.');
});

test('performance glitch user can still login', async ({ page }) => {
  await page.goto('/');
  await page.fill('#user-name', 'performance_glitch_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  
  await expect(page).toHaveURL(/inventory/, { timeout: 10000 });
});