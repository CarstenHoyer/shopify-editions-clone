import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('app loads without errors', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');

    // Wait for the page to load
    await expect(page).toHaveTitle(/Shopify Editions/);

    // Check that there are no console errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Wait for the canvas to be visible
    await page.waitForSelector('canvas', { timeout: 10000 });

    // Verify no critical errors
    expect(errors.filter((e) => !e.includes('WebGL'))).toHaveLength(0);
  });

  test('canvas element exists on page', async ({ page }) => {
    await page.goto('/');

    // Wait for the canvas element to appear (R3F renders to canvas)
    // Use .first() since multiple sections now have their own canvas elements
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible({ timeout: 10000 });

    // Verify it's a Three.js canvas (R3F uses three.js under the hood)
    await expect(canvas).toHaveAttribute('data-engine', /three\.js/);
  });
});
