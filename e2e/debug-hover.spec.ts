import { test, expect } from '@playwright/test';

test('debug hover', async ({ page }) => {
  // Listen for console
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.goto('/');
  await page.waitForSelector('canvas.webgl', { timeout: 10000 });
  await page.waitForTimeout(2000); // longer wait

  // Inject a global event listener in the page to detect R3F pointer events
  await page.evaluate(() => {
    (window as unknown as Record<string, unknown>).__r3fPointerEvents = [];
    // Try to intercept R3F events if possible
    const origDispatch = EventTarget.prototype.dispatchEvent;
    EventTarget.prototype.dispatchEvent = function(event) {
      if (event.type.includes('pointer')) {
        console.log('[DEBUG] dispatchEvent:', event.type, 'target:', (this as Element).tagName || 'unknown');
      }
      return origDispatch.call(this, event);
    };
  });

  const canvas = page.locator('canvas.webgl').first();
  const box = await canvas.boundingBox();
  console.log('Canvas box:', box);

  if (!box) return;

  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;
  console.log('Moving to:', centerX, centerY);

  // Move mouse and trigger pointermove events
  await page.mouse.move(centerX, centerY, { steps: 5 });
  await page.waitForTimeout(1000);

  const cursor = await page.evaluate(() => document.body.style.cursor);
  console.log('Cursor after hover:', cursor);

  // Also check what's at that position
  const elementAtPoint = await page.evaluate(({ x, y }) => {
    const el = document.elementFromPoint(x, y);
    return el ? el.tagName + (el.className ? '.' + el.className : '') : 'null';
  }, { x: centerX, y: centerY });
  console.log('Element at point:', elementAtPoint);

  expect(true).toBe(true); // Pass for now to see debug output
});
