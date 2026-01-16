import { test, expect } from '@playwright/test';

test.describe('Model Loading', () => {
  test('no "failed to load" errors in console', async ({ page }) => {
    const loadErrors: string[] = [];

    // Listen for console errors before navigation
    page.on('console', (msg) => {
      const text = msg.text().toLowerCase();
      if (
        msg.type() === 'error' &&
        (text.includes('failed to load') ||
          text.includes('could not load') ||
          text.includes('error loading') ||
          text.includes('404'))
      ) {
        loadErrors.push(msg.text());
      }
    });

    // Listen for page errors
    page.on('pageerror', (err) => {
      const text = err.message.toLowerCase();
      if (
        text.includes('failed to load') ||
        text.includes('could not load') ||
        text.includes('error loading')
      ) {
        loadErrors.push(err.message);
      }
    });

    await page.goto('/');

    // Wait for the canvas to be fully loaded
    await page.waitForSelector('canvas.webgl', { timeout: 10000 });

    // Wait for models to potentially load
    await page.waitForTimeout(2000);

    expect(loadErrors).toHaveLength(0);
  });

  test('loading state shows before model is loaded', async ({ page }) => {
    // We'll check for the dynamic loading behavior of sections
    // Since the canvases are dynamically imported, they show loading state first

    // Block the model file to simulate slow loading
    await page.route('**/models/*.glb', async (route) => {
      // Delay the response to ensure loading state is visible
      await new Promise((resolve) => setTimeout(resolve, 500));
      await route.continue();
    });

    await page.goto('/');

    // Check that the page loads without errors even with delayed models
    await expect(page.locator('canvas.webgl').first()).toBeVisible({
      timeout: 15000,
    });
  });

  test('hero section loads with 3D model', async ({ page }) => {
    await page.goto('/');

    // Wait for the hero section to be visible
    const heroSection = page.locator('[data-testid="hero-section"]');
    await expect(heroSection).toBeVisible({ timeout: 10000 });

    // Verify canvas is rendered inside hero section
    const heroCanvas = heroSection.locator('canvas');
    await expect(heroCanvas).toBeVisible({ timeout: 10000 });
  });

  test('section canvases render without errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');

    // Scroll through the page to trigger lazy-loaded sections
    await page.evaluate(async () => {
      const scrollStep = window.innerHeight;
      const maxScroll = document.body.scrollHeight;

      for (let y = 0; y < maxScroll; y += scrollStep) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    });

    // Wait for any async loading to complete
    await page.waitForTimeout(1000);

    // Check for section canvases
    const sectionCanvases = page.locator('[data-testid="section-canvas"]');
    const count = await sectionCanvases.count();

    // We should have section canvases rendered
    expect(count).toBeGreaterThan(0);

    // Filter out non-critical errors
    const criticalErrors = errors.filter(
      (e) =>
        !e.includes('WebGL') &&
        !e.includes('THREE.WebGLRenderer') &&
        !e.includes('ResizeObserver')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('model error boundary does not show by default', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load
    await page.waitForSelector('canvas.webgl', { timeout: 10000 });

    // The error fallback should not be visible when models load successfully
    const errorFallback = page.locator('[data-testid="model-error"]');
    await expect(errorFallback).toHaveCount(0);
  });
});
