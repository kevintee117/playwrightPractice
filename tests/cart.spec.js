import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
});

test('add item to cart', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toBeVisible();
});

test('add all items to cart', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();
    const items = page.locator('.inventory_item');
    const tshirt = items.filter({ hasText: 'Test.allTheThings() T-Shirt (Red)' });
    await tshirt.getByRole('button', { name: 'Add to cart' }).click();
    //^^good to know about this way to get the elements for the interview
    await expect(page.locator('.shopping_cart_badge')).toHaveText('6');
});

test('can proceed to checkout', async ({ page }) => {
  await page.locator('.shopping_cart_link').click();
  await expect(page).toHaveURL(/cart/);
});

test('remove item from cart', async ({ page }) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
  await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
});

test('cart count persists after navigating away', async ({ page }) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.goto('/inventory-item.html?id=4');
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
});
