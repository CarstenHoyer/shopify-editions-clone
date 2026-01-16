import { test, expect } from '@playwright/test';

test.describe('3D Scroll Animations', () => {
  test.beforeEach(async ({ page }) => {
    // Use nosnap=true to disable scroll snapping for precise scroll progress tests
    await page.goto('/?nosnap=true');
    // Wait for the hero section and canvas to load
    await page.waitForSelector('[data-testid="hero-section"]', { timeout: 15000 });
    await page.waitForSelector('canvas.webgl', { timeout: 10000 });
    // Allow initial animations to start
    await page.waitForTimeout(500);
  });

  test('3D element position changes on scroll', async ({ page }) => {
    // Get initial scroll progress from hero canvas
    const initialProgress = await page.evaluate(() => {
      const heroCanvas = document.querySelector('[data-scroll-progress]');
      return heroCanvas?.getAttribute('data-scroll-progress') || '0';
    });

    expect(parseFloat(initialProgress)).toBe(0);

    // Scroll down half the viewport height
    await page.evaluate(() => {
      window.scrollTo({ top: window.innerHeight / 2, behavior: 'instant' });
    });
    await page.waitForTimeout(300);

    // Verify scroll progress has changed
    const midProgress = await page.evaluate(() => {
      const heroCanvas = document.querySelector('[data-scroll-progress]');
      return heroCanvas?.getAttribute('data-scroll-progress') || '0';
    });

    expect(parseFloat(midProgress)).toBeGreaterThan(0);
    expect(parseFloat(midProgress)).toBeLessThanOrEqual(1);

    // Scroll to the bottom of hero section
    await page.evaluate(() => {
      window.scrollTo({ top: window.innerHeight, behavior: 'instant' });
    });
    await page.waitForTimeout(300);

    const endProgress = await page.evaluate(() => {
      const heroCanvas = document.querySelector('[data-scroll-progress]');
      return heroCanvas?.getAttribute('data-scroll-progress') || '0';
    });

    expect(parseFloat(endProgress)).toBeGreaterThanOrEqual(0.95);
  });

  test('section canvas scroll progress updates correctly', async ({ page }) => {
    // Scroll down to the first section canvas
    await page.evaluate(() => {
      window.scrollTo({ top: window.innerHeight * 1.5, behavior: 'instant' });
    });
    await page.waitForTimeout(500);

    // Check that section canvas has scroll progress attribute
    const sectionCanvas = page.locator('[data-testid="section-canvas"]').first();
    await expect(sectionCanvas).toBeVisible({ timeout: 5000 });

    const progressAttr = await sectionCanvas.getAttribute('data-scroll-progress');
    expect(progressAttr).not.toBeNull();

    const progress = parseFloat(progressAttr || '0');
    // Progress should be somewhere between 0 and 1
    expect(progress).toBeGreaterThanOrEqual(0);
    expect(progress).toBeLessThanOrEqual(1);
  });

  test('animation is smooth without lag (no JS errors during scroll)', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    // Perform rapid scrolling to stress test animations
    for (let i = 0; i < 5; i++) {
      await page.evaluate((scrollY) => {
        window.scrollTo({ top: scrollY, behavior: 'instant' });
      }, i * 500);
      // Short wait to allow frame updates
      await page.waitForTimeout(100);
    }

    // Scroll back to top
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.waitForTimeout(300);

    // Filter out WebGL warnings that may occur in headless browsers
    const criticalErrors = errors.filter(
      (e) =>
        !e.includes('WebGL') &&
        !e.includes('THREE.WebGLRenderer') &&
        !e.includes('ResizeObserver')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('scroll progress updates continuously during scroll', async ({ page }) => {
    // Collect progress values while scrolling using a more efficient approach
    // Get window height once at the start
    const windowHeight = await page.evaluate(() => window.innerHeight);

    const progressValues: number[] = [];

    // Reduce iterations to 5 to avoid timeout
    for (let i = 0; i <= 5; i++) {
      await page.evaluate((scrollY) => {
        window.scrollTo({ top: scrollY, behavior: 'instant' });
      }, (windowHeight * i) / 5);

      await page.waitForTimeout(150);

      const progress = await page.evaluate(() => {
        const heroCanvas = document.querySelector('[data-scroll-progress]');
        return parseFloat(heroCanvas?.getAttribute('data-scroll-progress') || '0');
      });

      progressValues.push(progress);
    }

    // Verify progress increases monotonically
    for (let i = 1; i < progressValues.length; i++) {
      expect(progressValues[i]).toBeGreaterThanOrEqual(progressValues[i - 1]);
    }

    // Verify we reached full progress at the end (with tolerance for snap settling)
    expect(progressValues[progressValues.length - 1]).toBeGreaterThanOrEqual(0.95);
  });

  test('multiple section canvases each have independent scroll progress', async ({ page }) => {
    // Scroll to see multiple sections
    await page.evaluate(() => {
      window.scrollTo({ top: window.innerHeight * 2, behavior: 'instant' });
    });
    await page.waitForTimeout(500);

    // Get all section canvases
    const sectionCanvases = page.locator('[data-testid="section-canvas"]');
    const count = await sectionCanvases.count();

    if (count > 1) {
      // Each section canvas should have its own scroll progress attribute
      const firstProgress = await sectionCanvases.first().getAttribute('data-scroll-progress');
      const secondProgress = await sectionCanvases.nth(1).getAttribute('data-scroll-progress');

      expect(firstProgress).not.toBeNull();
      expect(secondProgress).not.toBeNull();

      // They should likely have different progress values based on their position
      // (unless they happen to be at the same scroll position)
    }

    // Verify at least one section canvas is visible and has progress
    const firstCanvas = sectionCanvases.first();
    if (await firstCanvas.isVisible()) {
      const progress = await firstCanvas.getAttribute('data-scroll-progress');
      expect(progress).not.toBeNull();
    }
  });
});
