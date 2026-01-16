import { test, expect } from '@playwright/test';

const SECTIONS = [
  { id: 'sidekick', title: 'Sidekick' },
  { id: 'agentic', title: 'Agentic Commerce' },
  { id: 'online', title: 'Online Store' },
  { id: 'retail', title: 'Retail & POS' },
  { id: 'marketing', title: 'Marketing' },
  { id: 'checkout', title: 'Checkout' },
];

test.describe('Page Sections', () => {
  test('all section titles visible when scrolling', async ({ page }) => {
    // Use nosnap to prevent scroll-snap from interfering with scroll operations
    await page.goto('/?nosnap=true');
    await page.waitForSelector('[data-testid="hero-section"]', { timeout: 15000 });

    for (let i = 0; i < SECTIONS.length; i++) {
      const section = SECTIONS[i];
      // Use direct scroll to avoid scrollIntoViewIfNeeded timeout
      await page.evaluate((index) => {
        window.scrollTo({ top: window.innerHeight * (index + 1), behavior: 'instant' });
      }, i);
      await page.waitForTimeout(500);

      const sectionElement = page.locator(`[data-testid="section-${section.id}"]`);
      await expect(sectionElement).toBeVisible({ timeout: 10000 });

      const titleElement = page.locator(`[data-testid="section-title-${section.id}"]`);
      await expect(titleElement).toBeVisible({ timeout: 10000 });
      await expect(titleElement).toContainText(section.title);
    }
  });

  test('at least 6 sections render', async ({ page }) => {
    await page.goto('/?nosnap=true');

    // Scroll to bottom to ensure all sections are loaded
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    const sections = page.locator('[data-testid^="section-"]');
    const count = await sections.count();
    expect(count).toBeGreaterThanOrEqual(6);
  });

  test('each section has unique 3D canvas', async ({ page }) => {
    await page.goto('/?nosnap=true');
    await page.waitForSelector('[data-testid="hero-section"]', { timeout: 15000 });

    for (let i = 0; i < SECTIONS.length; i++) {
      const section = SECTIONS[i];
      // Use direct scroll to avoid scrollIntoViewIfNeeded timeout with GSAP animations
      await page.evaluate((index) => {
        window.scrollTo({ top: window.innerHeight * (index + 1), behavior: 'instant' });
      }, i);
      await page.waitForTimeout(500);

      const sectionElement = page.locator(`[data-testid="section-${section.id}"]`);
      await expect(sectionElement).toBeVisible({ timeout: 10000 });

      // Check that the section content canvas exists
      // Use specific selector for section-canvas to avoid matching transition-canvas
      const canvas = sectionElement.locator('[data-testid="section-canvas"] canvas').first();
      await expect(canvas).toBeVisible({ timeout: 15000 });
    }
  });

  test('sections have correct spacing', async ({ page }) => {
    await page.goto('/?nosnap=true');
    await page.waitForSelector('[data-testid="hero-section"]', { timeout: 15000 });

    // First scroll to bottom to ensure all sections are rendered
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    // Then check each section
    for (let i = 0; i < SECTIONS.length; i++) {
      const section = SECTIONS[i];
      // Use direct scroll
      await page.evaluate((index) => {
        window.scrollTo({ top: window.innerHeight * (index + 1), behavior: 'instant' });
      }, i);
      await page.waitForTimeout(300);

      const sectionElement = page.locator(`[data-testid="section-${section.id}"]`);

      // Wait for the section element to be visible before getting bounding box
      await expect(sectionElement).toBeVisible({ timeout: 5000 });

      // Use evaluate to get bounding box directly to avoid Playwright timeout issues
      const box = await page.evaluate((sectionId) => {
        const el = document.querySelector(`[data-testid="section-${sectionId}"]`);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      }, section.id);
      expect(box).not.toBeNull();

      // Each section should have minimum height
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(400);
      }
    }
  });
});
