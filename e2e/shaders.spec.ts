import { test, expect } from '@playwright/test';

test.describe('Shader Setup', () => {
  test('page loads without WebGL errors', async ({ page }) => {
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

    // Give time for shader compilation and rendering
    await page.waitForTimeout(2000);

    // Filter for WebGL-specific errors (shader compilation, context issues)
    const webglErrors = errors.filter(
      (e) =>
        e.toLowerCase().includes('shader') ||
        e.toLowerCase().includes('webgl') ||
        e.toLowerCase().includes('glsl')
    );

    // Should have no shader compilation errors
    expect(webglErrors).toHaveLength(0);
  });

  test('canvas renders without crashing', async ({ page }) => {
    await page.goto('/');

    // Wait for the canvas to be present
    const canvas = page.locator('canvas.webgl');
    await expect(canvas).toBeVisible({ timeout: 10000 });

    // Verify the canvas has non-zero dimensions (rendering is happening)
    const boundingBox = await canvas.boundingBox();
    expect(boundingBox).not.toBeNull();
    expect(boundingBox!.width).toBeGreaterThan(0);
    expect(boundingBox!.height).toBeGreaterThan(0);
  });

  test('WebGL context is valid after shader load', async ({ page }) => {
    await page.goto('/');

    // Wait for canvas to be ready
    await page.waitForSelector('canvas.webgl', { timeout: 10000 });

    // Check that WebGL context is valid and not lost
    const hasValidContext = await page.evaluate(() => {
      const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;
      if (!canvas) return false;

      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) return false;

      // Check if context is lost
      return !gl.isContextLost();
    });

    expect(hasValidContext).toBe(true);
  });

  test('shader renders without errors', async ({ page }) => {
    const errors: string[] = [];

    // Capture any errors during rendering
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');

    // Wait for canvas and shader to initialize
    await page.waitForSelector('canvas.webgl', { timeout: 10000 });
    await page.waitForTimeout(2000); // Allow shader animation to start

    // Verify canvas is still present after shader initialization
    const canvas = page.locator('canvas.webgl');
    await expect(canvas).toBeVisible();

    // Verify no shader-related errors occurred during rendering
    const shaderErrors = errors.filter(
      (e) =>
        e.toLowerCase().includes('shader') ||
        e.toLowerCase().includes('glsl') ||
        e.toLowerCase().includes('compile')
    );

    expect(shaderErrors).toHaveLength(0);
  });
});
