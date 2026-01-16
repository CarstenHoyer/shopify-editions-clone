import { test, expect } from '@playwright/test';

test.describe('Scroll Functionality', () => {
  test('scroll to bottom and back works without JS errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto('/');
    // Wait for the hero section to load (always present)
    await page.waitForSelector('[data-testid="hero-section"]', { timeout: 15000 });

    // Wait a bit for all content to render
    await page.waitForTimeout(1000);

    // Get initial scroll position
    const initialScrollY = await page.evaluate(() => window.scrollY);
    expect(initialScrollY).toBe(0);

    // Scroll down
    await page.evaluate(() => {
      window.scrollTo({ top: 500, behavior: 'instant' });
    });
    await page.waitForTimeout(300);

    // Scroll back to top
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.waitForTimeout(300);

    // Verify we're back at the top
    const finalScrollY = await page.evaluate(() => window.scrollY);
    expect(finalScrollY).toBe(0);

    // No JS errors should have occurred
    expect(errors).toHaveLength(0);
  });

  test('smooth scroll behavior is applied', async ({ page }) => {
    await page.goto('/');
    // Wait for page to load
    await page.waitForSelector('[data-testid="hero-section"]', { timeout: 15000 });

    // Check that CSS smooth scroll is set on html element
    const scrollBehavior = await page.evaluate(() => {
      const html = document.documentElement;
      return window.getComputedStyle(html).scrollBehavior;
    });
    expect(scrollBehavior).toBe('smooth');
  });
});
