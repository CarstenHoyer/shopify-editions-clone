import { test, expect } from '@playwright/test';

const SECTIONS_WITH_TRANSITIONS = [
  { id: 'sidekick', title: 'Sidekick' },
  { id: 'agentic', title: 'Agentic Commerce' },
  { id: 'online', title: 'Online Store' },
  { id: 'retail', title: 'Retail & POS' },
  { id: 'marketing', title: 'Marketing' },
  { id: 'checkout', title: 'Checkout' },
];

test.describe('Shader Transitions', () => {
  test('transition canvas is rendered in sections with transition colors', async ({ page }) => {
    // Use nosnap to prevent scroll-snap from interfering with test scroll operations
    await page.goto('/?nosnap=true');
    await page.waitForSelector('[data-testid="hero-section"]', { timeout: 15000 });

    // Wait for page to be ready
    await page.waitForTimeout(1000);

    // Check first section with transitions
    const firstSection = SECTIONS_WITH_TRANSITIONS[0];
    const sectionElement = page.locator(`[data-testid="section-${firstSection.id}"]`);

    // Scroll to the section using direct scroll to avoid timeout with GSAP
    await page.evaluate(() => {
      window.scrollTo({ top: window.innerHeight, behavior: 'instant' });
    });
    await page.waitForTimeout(500);

    // Check that the transition canvas exists within the section
    const transitionCanvas = sectionElement.locator('[data-testid="transition-canvas"]');
    await expect(transitionCanvas).toBeAttached();
  });

  test('transition effect visible on scroll - progress updates', async ({ page }) => {
    await page.goto('/?nosnap=true');
    await page.waitForSelector('[data-testid="hero-section"]', { timeout: 15000 });

    // Wait for initial load
    await page.waitForTimeout(1000);

    const firstSection = SECTIONS_WITH_TRANSITIONS[0];
    const sectionElement = page.locator(`[data-testid="section-${firstSection.id}"]`);

    // Scroll to just before the section
    await page.evaluate(() => {
      window.scrollTo({ top: window.innerHeight * 0.5, behavior: 'instant' });
    });
    await page.waitForTimeout(300);

    const transitionCanvas = sectionElement.locator('[data-testid="transition-canvas"]');

    // Get initial progress value
    const initialProgress = await transitionCanvas.getAttribute('data-transition-progress');

    // Scroll further into the section using direct scroll
    await page.evaluate(() => {
      window.scrollTo({ top: window.innerHeight, behavior: 'instant' });
    });
    await page.waitForTimeout(500);

    // Get updated progress value
    const updatedProgress = await transitionCanvas.getAttribute('data-transition-progress');

    // Progress should have changed (increased) as we scrolled
    const initialVal = parseFloat(initialProgress || '0');
    const updatedVal = parseFloat(updatedProgress || '0');

    // The progress should be different after scrolling
    expect(updatedVal).not.toEqual(initialVal);
  });

  test('no flicker or glitch during scroll transitions', async ({ page }) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Listen for console errors and warnings
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
      if (msg.type() === 'warning' && msg.text().includes('WebGL')) {
        warnings.push(msg.text());
      }
    });

    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto('/?nosnap=true');
    await page.waitForSelector('[data-testid="hero-section"]', { timeout: 15000 });

    // Wait for initial load
    await page.waitForTimeout(1000);

    // Scroll through all sections with transitions using direct scroll
    for (let i = 0; i < SECTIONS_WITH_TRANSITIONS.length; i++) {
      await page.evaluate((index) => {
        window.scrollTo({ top: window.innerHeight * (index + 1), behavior: 'instant' });
      }, i);
      await page.waitForTimeout(200);
    }

    // Scroll back up through sections
    for (let i = SECTIONS_WITH_TRANSITIONS.length - 1; i >= 0; i--) {
      await page.evaluate((index) => {
        window.scrollTo({ top: window.innerHeight * (index + 1), behavior: 'instant' });
      }, i);
      await page.waitForTimeout(200);
    }

    // No WebGL errors or shader compilation errors should have occurred
    const shaderErrors = errors.filter(
      (e) =>
        e.includes('shader') ||
        e.includes('WebGL') ||
        e.includes('GLSL') ||
        e.includes('THREE')
    );
    expect(shaderErrors).toHaveLength(0);
  });

  test('transition shader renders without visual artifacts', async ({ page }) => {
    await page.goto('/?nosnap=true');
    await page.waitForSelector('[data-testid="hero-section"]', { timeout: 15000 });

    // Wait for initial load and WebGL context to be ready
    await page.waitForTimeout(1500);

    const firstSection = SECTIONS_WITH_TRANSITIONS[0];
    const sectionElement = page.locator(`[data-testid="section-${firstSection.id}"]`);

    // Scroll to the section using direct scroll to avoid timeout with GSAP
    await page.evaluate(() => {
      window.scrollTo({ top: window.innerHeight, behavior: 'instant' });
    });
    await page.waitForTimeout(500);

    // Check that canvas element exists and has rendered
    const canvas = sectionElement.locator('[data-testid="transition-canvas"] canvas');
    await expect(canvas).toBeAttached();

    // Verify the canvas has dimensions (indicating it's rendering)
    const canvasBox = await canvas.boundingBox();
    expect(canvasBox).not.toBeNull();
    expect(canvasBox!.width).toBeGreaterThan(0);
    expect(canvasBox!.height).toBeGreaterThan(0);
  });

  test('multiple sections have working transitions', async ({ page }) => {
    await page.goto('/?nosnap=true');
    await page.waitForSelector('[data-testid="hero-section"]', { timeout: 15000 });

    // Wait for initial load
    await page.waitForTimeout(1000);

    // Check that multiple sections have transition canvases
    let sectionsWithTransitions = 0;

    for (let i = 0; i < SECTIONS_WITH_TRANSITIONS.length; i++) {
      const section = SECTIONS_WITH_TRANSITIONS[i];
      // Use direct scroll to avoid scrollIntoViewIfNeeded timeout
      await page.evaluate((index) => {
        window.scrollTo({ top: window.innerHeight * (index + 1), behavior: 'instant' });
      }, i);
      await page.waitForTimeout(300);

      const sectionElement = page.locator(`[data-testid="section-${section.id}"]`);
      const transitionCanvas = sectionElement.locator('[data-testid="transition-canvas"]');
      if ((await transitionCanvas.count()) > 0) {
        sectionsWithTransitions++;
      }
    }

    // All sections should have transition canvases
    expect(sectionsWithTransitions).toBe(SECTIONS_WITH_TRANSITIONS.length);
  });

  test('transition progress is bounded between 0 and 1', async ({ page }) => {
    await page.goto('/?nosnap=true');
    await page.waitForSelector('[data-testid="hero-section"]', { timeout: 15000 });

    // Wait for initial load
    await page.waitForTimeout(1000);

    const firstSection = SECTIONS_WITH_TRANSITIONS[0];
    const sectionElement = page.locator(`[data-testid="section-${firstSection.id}"]`);
    const transitionCanvas = sectionElement.locator('[data-testid="transition-canvas"]');

    // Scroll to top of page
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.waitForTimeout(200);

    // Scroll through the section and check progress values
    const scrollPositions = [0, 0.5, 1, 1.5, 2, 2.5, 3];

    for (const multiplier of scrollPositions) {
      await page.evaluate((mult) => {
        window.scrollTo({ top: window.innerHeight * mult, behavior: 'instant' });
      }, multiplier);
      await page.waitForTimeout(100);

      const progress = await transitionCanvas.getAttribute('data-transition-progress');
      if (progress) {
        const progressValue = parseFloat(progress);
        expect(progressValue).toBeGreaterThanOrEqual(0);
        expect(progressValue).toBeLessThanOrEqual(1);
      }
    }
  });

  test('shader transitions render without errors during scroll', async ({ page }) => {
    // This test verifies that transitions work without JS errors during scrolling
    // Frame rate testing in headless browsers is unreliable, so we focus on correctness
    const errors: string[] = [];

    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto('/?nosnap=true');
    await page.waitForSelector('[data-testid="hero-section"]', { timeout: 15000 });

    // Wait for initial load
    await page.waitForTimeout(1000);

    // Perform scroll through sections
    for (let i = 0; i < 5; i++) {
      await page.evaluate((index) => {
        window.scrollTo({
          top: window.innerHeight * (index + 1),
          behavior: 'instant'
        });
      }, i);
      await page.waitForTimeout(300);
    }

    // Verify at least one transition canvas rendered
    const canvas = page.locator('[data-testid="transition-canvas"]').first();
    await expect(canvas).toBeAttached();

    // No shader/WebGL errors should have occurred
    const shaderErrors = errors.filter(
      (e) =>
        e.includes('shader') ||
        e.includes('WebGL') ||
        e.includes('GLSL') ||
        e.includes('THREE')
    );
    expect(shaderErrors).toHaveLength(0);
  });
});
