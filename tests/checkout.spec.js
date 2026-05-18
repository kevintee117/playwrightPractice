import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
});

async function addItemsAndProceedToSummary(page, items) {
  for (const item of items) {
    await page.locator(`[data-test="add-to-cart-${item}"]`).click();
  }
  await page.locator('.shopping_cart_link').click();
  await page.locator('[data-test="checkout"]').click();
  await page.fill('#first-name', 'first name');
  await page.fill('#last-name', 'last name');
  await page.fill('#postal-code', '12345');
  await page.locator('[data-test="continue"]').click();
}

//happy-path
test('test checkout flow happy path', async ({ page}) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.fill('#first-name', 'first name');
    await page.fill('#last-name', 'last name');
    await page.fill('#postal-code', '12345');
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="finish"]').click();
    await expect(page).toHaveURL(/checkout-complete/);
})

//form validation tests
test('test checkout empty first name', async ({ page}) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toHaveText('Error: First Name is required');
})

test('test checkout empty last name', async ({ page}) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.fill('#first-name', 'first name');
    await page.fill('#postal-code', '12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toHaveText('Error: Last Name is required');
})

test('test checkout empty zip code', async ({ page}) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.fill('#first-name', 'first name');
    await page.fill('#last-name', 'last name');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toHaveText('Error: Postal Code is required');
})

//Cart accuracy before checkout tests

test('test cart accuracy 1 item', async ({ page }) => {
  await addItemsAndProceedToSummary(page, ['sauce-labs-backpack']);
  await expect(page.locator('[data-test="subtotal-label"]')).toContainText('Item total: $29.99');
  await expect(page.locator('[data-test="total-label"]')).toContainText('Total: $32.39');
});

test('test cart accuracy 2 items', async ({ page }) => {
  await addItemsAndProceedToSummary(page, ['sauce-labs-backpack', 'sauce-labs-bike-light']);
  await expect(page.locator('[data-test="subtotal-label"]')).toContainText('Item total: $39.98');
  await expect(page.locator('[data-test="total-label"]')).toContainText('Total: $43.18');
});


test('test cart accuracy all items', async ({ page}) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();
    const items = page.locator('.inventory_item');
    const tshirt = items.filter({ hasText: 'Test.allTheThings() T-Shirt (Red)' });
    await tshirt.getByRole('button', { name: 'Add to cart' }).click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.fill('#first-name', 'first name');
    await page.fill('#last-name', 'last name');
    await page.fill('#postal-code', '12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="item-4-title-link"] [data-test="inventory-item-name"]')).toContainText('Sauce Labs Backpack');
    await expect(page.locator('[data-test="item-0-title-link"] [data-test="inventory-item-name"]')).toContainText('Sauce Labs Bike Light');
    await expect(page.locator('[data-test="item-5-title-link"] [data-test="inventory-item-name"]')).toContainText('Sauce Labs Fleece Jacket');
    await expect(page.locator('[data-test="item-1-title-link"] [data-test="inventory-item-name"]')).toContainText('Sauce Labs Bolt T-Shirt');
    await expect(page.locator('[data-test="item-2-title-link"] [data-test="inventory-item-name"]')).toContainText('Sauce Labs Onesie');
    await expect(page.locator('[data-test="item-3-title-link"] [data-test="inventory-item-name"]')).toContainText('Test.allTheThings() T-Shirt (Red)');
    await expect(page.locator('[data-test="subtotal-label"]')).toContainText('Item total: $129.94');
    await expect(page.locator('[data-test="tax-label"]')).toContainText('Tax: $10.40');
    await expect(page.locator('[data-test="total-label"]')).toContainText('Total: $140.34'); 
})

//Cancel out of checkout tests
test('test cancel out of checkout', async ({ page}) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();
    const items = page.locator('.inventory_item');
    const tshirt = items.filter({ hasText: 'Test.allTheThings() T-Shirt (Red)' });
    await tshirt.getByRole('button', { name: 'Add to cart' }).click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.fill('#first-name', 'first name');
    await page.fill('#last-name', 'last name');
    await page.fill('#postal-code', '12345');
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="cancel"]').click();
    await expect(page).toHaveURL(/inventory/);
})

test('Cart is empty after completing order', async ({ page}) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.fill('#first-name', 'first name');
    await page.fill('#last-name', 'last name');
    await page.fill('#postal-code', '12345');
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="finish"]').click();
    await expect(page).toHaveURL(/checkout-complete/);
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.cart_item')).toHaveCount(0);
})


