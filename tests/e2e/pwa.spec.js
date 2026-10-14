import { expect, test } from '@playwright/test';

test('manifest e service worker estão registrados', async ({ page }) => {
  await page.goto('/');

  // Manifest
  const manifestUrl = await page.evaluate(() => {
    return document.querySelector('link[rel="manifest"]')?.href;
  });
  expect(manifestUrl).toBeTruthy();

  // Service Worker
  const swReady = await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return false;
    const reg = await navigator.serviceWorker.ready;
    return !!reg.active;
  });
  expect(swReady).toBe(true);
});

test('funciona offline após reload', async ({ page, context }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Ativa modo offline
  await context.setOffline(true);
  await page.reload();

  // Verifica que o app shell ainda carrega
  await expect(page.locator('.navbar-js')).toBeVisible();
});
