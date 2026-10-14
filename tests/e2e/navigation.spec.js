import { expect, test } from '@playwright/test';

test('navegação entre capítulos carrega conteúdo', async ({ page }) => {
  await page.goto('/tutorial.html');
  await page.waitForSelector('#lessonContent h2');

  // Clica no capítulo 5 (Funções)
  await page.click('a[data-route="funcoes"]');
  await expect(page.locator('#lessonContent h2').first()).toContainText('Funções');

  // URL atualizada
  expect(page.url()).toContain('#funcoes');
});

test('busca abre com Ctrl+K e filtra resultados', async ({ page }) => {
  await page.goto('/tutorial.html');
  await page.keyboard.press('Control+KeyK');
  await expect(page.locator('#searchOverlay')).toHaveClass(/is-open/);

  await page.fill('#searchInput', 'promise');
  await expect(page.locator('#searchResults a').first()).toContainText('promises');
});
