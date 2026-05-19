import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
let loginPage;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  loginPage = new LoginPage(page)
});

test('successful login', async ({ page }) => {
  await loginPage.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL(/inventory/);
});


test('failed login', async ({ page }) => {
  await loginPage.login('abcedefewr', 'fewfewdfsa');
  await expect(page.locator('[data-test="error"]')).toBeVisible();
});

test('empty username', async ({ page }) => {
  await page.click('#login-button');
  await expect(page.locator('[data-test="error"]')).toBeVisible();
  await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Username is required');
});


test('empty password', async ({ page }) => {
  await loginPage.login('abcedefewr', '');
  await expect(page.locator('[data-test="error"]')).toBeVisible();
  await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Password is required');
});

test('locked out user', async ({ page }) => {
  await loginPage.login('locked_out_user', 'secret_sauce');
  await expect(page.locator('[data-test="error"]')).toBeVisible();
  await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Sorry, this user has been locked out.');
});

test('performance glitch user can still login', async ({ page }) => {
  await loginPage.login('performance_glitch_user', 'secret_sauce');
  await expect(page).toHaveURL(/inventory/, { timeout: 10000 });
});