import { test, expect } from '@playwright/test';

test.describe('Hero Section', () => {
  test('hero section is visible', async ({ page }) => {
    await page.goto('/');

    const heroSection = page.locator('[data-testid="hero-section"]');
    await expect(heroSection).toBeVisible({ timeout: 10000 });
  });

  test('title text exists', async ({ page }) => {
    await page.goto('/');

    const title = page.locator('[data-testid="hero-title"]');
    await expect(title).toBeVisible({ timeout: 10000 });
    await expect(title).toContainText("Winter '26");
  });

  test('canvas exists within hero', async ({ page }) => {
    await page.goto('/');

    const heroSection = page.locator('[data-testid="hero-section"]');
    await expect(heroSection).toBeVisible({ timeout: 10000 });

    const canvas = heroSection.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });
  });

  test('hero section fills viewport height', async ({ page }) => {
    await page.goto('/');

    const heroSection = page.locator('[data-testid="hero-section"]');
    await expect(heroSection).toBeVisible({ timeout: 10000 });

    const viewportSize = page.viewportSize();
    const heroBox = await heroSection.boundingBox();

    expect(heroBox).not.toBeNull();
    if (heroBox && viewportSize) {
      expect(heroBox.height).toBeGreaterThanOrEqual(viewportSize.height - 1);
    }
  });

  test('subtitle text exists', async ({ page }) => {
    await page.goto('/');

    const subtitle = page.locator('[data-testid="hero-subtitle"]');
    await expect(subtitle).toBeVisible({ timeout: 10000 });
    await expect(subtitle).toContainText('Shopify Editions');
  });
});
