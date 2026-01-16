import { test, expect, Page } from '@playwright/test';

// Helper function to wait for cursor change with polling
async function waitForCursor(page: Page, expectedCursor: string, timeout = 2000): Promise<string> {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    const cursor = await page.evaluate(() => document.body.style.cursor);
    if (cursor === expectedCursor) {
      return cursor;
    }
    await page.waitForTimeout(100);
  }
  // Return final cursor state even if not matching
  return page.evaluate(() => document.body.style.cursor);
}

test.describe('Hover Effects', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the canvas to be fully loaded
    await page.waitForSelector('canvas.webgl', { timeout: 10000 });
    // Wait for initial animations and R3F render loop to settle
    await page.waitForTimeout(2000);
  });

  test('cursor changes to pointer over 3D element', async ({ page }) => {
    // Capture console logs for debugging
    page.on('console', msg => {
      if (msg.text().includes('HitTestMesh') || msg.text().includes('BackgroundPlane') || msg.text().includes('useCursorChange') || msg.text().includes('useHover')) {
        console.log('PAGE:', msg.text());
      }
    });

    const canvas = page.locator('canvas.webgl').first();
    await expect(canvas).toBeVisible();

    // Get canvas bounding box
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;

    // Move to center of canvas where the 3D model should be
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;

    // Check initial cursor is default
    const initialCursor = await page.evaluate(() => document.body.style.cursor);
    expect(initialCursor === '' || initialCursor === 'default' || initialCursor === 'auto').toBeTruthy();

    // Move mouse to center of canvas (where 3D model is)
    await page.mouse.move(centerX, centerY);

    // Wait for hover detection and cursor change with polling
    const hoverCursor = await waitForCursor(page, 'pointer', 2000);
    expect(hoverCursor).toBe('pointer');

    // Move mouse away from the model
    await page.mouse.move(box.x + 10, box.y + 10);

    // Wait for hover state to clear
    await page.waitForTimeout(500);

    // Cursor should return to default
    const exitCursor = await page.evaluate(() => document.body.style.cursor);
    console.log('Exit cursor value:', exitCursor);
    expect(exitCursor === '' || exitCursor === 'default' || exitCursor === 'auto').toBeTruthy();
  });

  test('hover state activates with visual change', async ({ page }) => {
    const canvas = page.locator('canvas.webgl').first();
    await expect(canvas).toBeVisible();

    // Get canvas bounding box
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;

    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;

    // Take screenshot before hover
    const beforeHoverScreenshot = await canvas.screenshot();

    // Move mouse to center of canvas to trigger hover
    await page.mouse.move(centerX, centerY);

    // Wait for hover detection with polling
    const cursor = await waitForCursor(page, 'pointer', 2000);
    expect(cursor).toBe('pointer');

    // Wait a bit more for visual effect to fully activate
    await page.waitForTimeout(300);

    // Take screenshot during hover
    const duringHoverScreenshot = await canvas.screenshot();

    // The screenshots should be different (visual change occurred)
    // If animation is active, frames will differ
    expect(beforeHoverScreenshot).not.toEqual(duringHoverScreenshot);
  });

  test('hover transition is smooth (not instant)', async ({ page }) => {
    const canvas = page.locator('canvas.webgl').first();
    await expect(canvas).toBeVisible();

    // Get canvas bounding box
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;

    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;

    // Move to model to trigger hover
    await page.mouse.move(centerX, centerY);

    // Wait for cursor to change (interaction detected)
    const cursor = await waitForCursor(page, 'pointer', 2000);
    expect(cursor).toBe('pointer');

    // Take intermediate screenshot
    const intermediateScreenshot = await canvas.screenshot();

    // Wait for full transition
    await page.waitForTimeout(400);

    // Take final screenshot
    const finalScreenshot = await canvas.screenshot();

    // The intermediate and final screenshots should differ
    // (showing the transition is progressive, not instant)
    expect(intermediateScreenshot).not.toEqual(finalScreenshot);
  });

  test('multiple hover in/out cycles work correctly', async ({ page }) => {
    const canvas = page.locator('canvas.webgl').first();
    await expect(canvas).toBeVisible();

    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;

    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;
    const outsideX = box.x + 10;
    const outsideY = box.y + 10;

    // Perform multiple hover cycles
    for (let i = 0; i < 3; i++) {
      // Hover over model
      await page.mouse.move(centerX, centerY);
      const hoverCursor = await waitForCursor(page, 'pointer', 2000);
      expect(hoverCursor).toBe('pointer');

      // Move away
      await page.mouse.move(outsideX, outsideY);
      // Wait for cursor to return to default
      await page.waitForTimeout(500);

      const exitCursor = await page.evaluate(() => document.body.style.cursor);
      expect(exitCursor === '' || exitCursor === 'default' || exitCursor === 'auto').toBeTruthy();
    }
  });

  test('no console errors during hover interactions', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Filter out common WebGL warnings that aren't actual errors
        if (
          !text.includes('WebGL') &&
          !text.includes('THREE.WebGLRenderer') &&
          !text.includes('ResizeObserver')
        ) {
          errors.push(text);
        }
      }
    });

    const canvas = page.locator('canvas.webgl').first();
    await expect(canvas).toBeVisible();

    const box = await canvas.boundingBox();
    if (!box) return;

    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;

    // Perform hover interactions
    await page.mouse.move(centerX, centerY);
    await waitForCursor(page, 'pointer', 2000);

    await page.mouse.move(box.x + 10, box.y + 10);
    await page.waitForTimeout(500);

    // Verify no errors occurred
    expect(errors).toHaveLength(0);
  });
});
