import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const publicRoutes = ['/'];
const sectionRoutes = ['home', 'work', 'writing', 'about', 'contact'];

test('custom 404 and empty RSS behave honestly', async ({page,request}) => {
  await page.goto('/404.html');
  await expect(page.locator('main h1')).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex');
  expect((await request.get('/rss.xml')).status()).toBe(200);
  expect(await (await request.get('/rss.xml')).text()).toContain('<rss');
});

test('reduced motion removes UI transitions', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  expect(await page.locator('.button').first().evaluate(el => getComputedStyle(el).transitionDuration)).toBe('0s');
});

test.describe('public routes', () => {
  for (const route of publicRoutes) {
    test(`${route} is directly reachable, rendered without islands, and has SEO metadata`, async ({ page, request }) => {
      const response = await request.get(route);
      expect(response.status(), `${route} should return HTTP 200`).toBe(200);
      const html = await response.text();
      expect(html).toContain('<main');
      expect(html).not.toContain('astro-island');

      await page.goto(route);
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      await expect(page.locator('main h1')).toHaveCount(1);
      await expect(page).not.toHaveTitle(/Welcome!|Vite/i);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S.{30}/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://matheusode.me${route}`);

      for (const property of ['og:title', 'og:description', 'og:image', 'og:url']) {
        await expect(page.locator(`meta[property="${property}"]`)).toHaveAttribute('content', /\S/);
      }
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');

      const image = await page.locator('meta[property="og:image"]').getAttribute('content');
      expect(image).toBeTruthy();
      expect((await request.get(new URL(image!).pathname)).ok()).toBeTruthy();
    });

    test(`${route} passes the WCAG axe smoke check`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
    });
  }
});

test('site navigation marks exactly one current page and local links resolve', async ({ page, request }) => {
  await page.goto('/');
  for (const section of sectionRoutes) {
    await page.goto(`/#${section}`);
    const active = page.locator('nav a[aria-current="page"]:visible');
    await expect(active).toHaveCount(1);
    await expect(active).toHaveAttribute('href', `/#${section}`);
  }
  const links = await page.locator('a[href]').evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute('href')).filter((href): href is string => Boolean(href)));
  for (const href of links.filter((href) => href.startsWith('/#'))) expect((await request.get('/')).ok(), href).toBeTruthy();
  expect((await request.get('/robots.txt')).ok()).toBeTruthy();
  expect((await request.get('/sitemap.xml')).ok()).toBeTruthy();
});

test('contact and navigation work with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ baseURL: 'http://127.0.0.1:4347', javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/contact/');
  await expect(page.locator('main a[href^="mailto:"]').first()).toBeVisible();
  await expect(page.locator('main a[href*="linkedin.com/in/"]').first()).toBeVisible();
  await page.getByRole('navigation').getByRole('link', { name: 'Work', exact: true }).first().click();
  await expect(page).toHaveURL(/#work$/);
  await context.close();
});

test('desktop sidebar is keyboard-operable and the skip link reaches main content', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: /skip to/i })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();

  // Use the stable id because the accessible label intentionally changes to
  // “Expand sidebar” after the first activation.
  const toggle = page.locator('#sidebar-toggle');
  await expect(toggle).toBeVisible();
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('body')).toHaveClass(/sidebar-collapsed/);
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
});

test('mobile navigation opens as a dialog and restores focus when closed', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const opener = page.locator('#menu-open');
  await expect(opener).toBeVisible();
  await opener.focus();
  await page.keyboard.press('Enter');
  const dialog = page.locator('#mobile-menu');
  await expect(dialog).toBeVisible();
  await expect(opener).toHaveAttribute('aria-expanded', 'true');
  await expect(dialog.getByRole('link', { name: 'Contact', exact: true })).toBeVisible();
  await dialog.getByRole('button', { name: /close menu/i }).click();
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
  await opener.click();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(opener).toHaveAttribute('aria-expanded', 'false');
  await expect(opener).toBeFocused();
});

for (const [width, height] of [[320, 568], [390, 844], [768, 1024], [1280, 720], [1440, 900]]) {
  test(`pages do not overflow horizontally at ${width}×${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    for (const route of publicRoutes) {
      await page.goto(route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), route).toBeTruthy();
      await expect(page.locator('main h1')).toBeVisible();
    }
  });
}

test('no analytics traffic is emitted when analytics is disabled', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (request) => {
    if (!request.url().startsWith('http://127.0.0.1:4347')) external.push(request.url());
  });
  await page.goto('/contact/');
  await expect(page.locator('main')).toBeVisible();
  expect(external).toEqual([]);
});

test.describe('background tesseract', () => {
  const canvas = '.tesseract-canvas';

  test('renders as a blurred, non-interactive fixed background', async ({ page }) => {
    await page.goto('/');
    const element = page.locator(canvas);
    await expect(element).toBeAttached();
    expect(await element.evaluate((node) => getComputedStyle(node).position)).toBe('fixed');
    expect(await element.evaluate((node) => getComputedStyle(node).pointerEvents)).toBe('none');
    expect(await element.evaluate((node) => getComputedStyle(node).filter)).toContain('blur');
    await expect(element).toHaveAttribute('aria-hidden', 'true');
    expect(await element.evaluate((node) => (node as HTMLCanvasElement).width)).toBeGreaterThan(0);
    await expect(page.locator('.tesseract-controls')).toHaveCount(0);
    await expect(page.locator('input[type="range"]')).toHaveCount(0);
  });

  test('moving the mouse changes the rendered canvas', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 720 });
    await page.goto('/');
    const before = await page.locator(canvas).evaluate((node) => (node as HTMLCanvasElement).toDataURL());
    await page.mouse.move(120, 120);
    await page.mouse.move(900, 600, { steps: 12 });
    await page.waitForTimeout(400);
    const after = await page.locator(canvas).evaluate((node) => (node as HTMLCanvasElement).toDataURL());
    expect(after).not.toBe(before);
  });

  test('reduced motion renders the background without animation errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator(canvas)).toBeAttached();
    expect(errors).toEqual([]);
  });

  test('repeated navigation does not leave animation errors behind', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/');
    await page.goto('/work/');
    await page.goto('/');
    await expect(page.locator(canvas)).toBeAttached();
    expect(errors).toEqual([]);
  });
});
