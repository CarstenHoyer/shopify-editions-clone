import { test, expect } from '@playwright/test';

test.describe('Canvas Setup', () => {
  test('canvas element with class "webgl" exists', async ({ page }) => {
    await page.goto('/');

    // Wait for and verify the canvas with webgl class
    const canvas = page.locator('canvas.webgl');
    await expect(canvas).toBeVisible({ timeout: 10000 });
  });

  test('no console errors on load', async ({ page }) => {
    const errors: string[] = [];

    // Listen for console errors before navigation
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');

    // Wait for the canvas to be fully loaded
    await page.waitForSelector('canvas.webgl', { timeout: 10000 });

    // Give a moment for any async errors to surface
    await page.waitForTimeout(1000);

    // Filter out known WebGL warnings that may occur in headless browsers
    const criticalErrors = errors.filter(
      (e) => !e.includes('WebGL') && !e.includes('THREE.WebGLRenderer')
    );

    expect(criticalErrors).toHaveLength(0);
  });
});
