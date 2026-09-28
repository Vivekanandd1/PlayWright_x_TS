// steps/hooks.ts
import { Before, After, BeforeAll, AfterAll, setDefaultTimeout, Status } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext } from '@playwright/test';
import { ScreenshotHelper } from '../Utils/ScreenshotHelper';
import { fixture } from '../Utils/fixture';
import * as fs from 'node:fs/promises';

setDefaultTimeout(180000);

let browser: Browser;
let context: BrowserContext;

BeforeAll(async () => {
  const headless = !!process.env.CI;
  console.log(`[Browser] Launching Chromium. headless=${headless}, CI=${process.env.CI ?? 'false'}`);
  browser = await chromium.launch({ headless });
  console.log(`[Browser] Chromium launched. version=${browser.version()}`);
});

Before(async () => {
  context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  fixture.page = await context.newPage();
  fixture.page.setDefaultTimeout(180000);
  fixture.page.setDefaultNavigationTimeout(180000);

  console.log(`[Page] New page created. viewport=1280x720, initialUrl=${fixture.page.url()}`);

  fixture.page.on('framenavigated', frame => {
    if (frame === fixture.page.mainFrame()) {
      console.log(`[Navigation] Main frame URL: ${frame.url()}`);
    }
  });

  fixture.page.on('requestfailed', request => {
    console.warn(`[Network] Request failed: ${request.method()} ${request.url()} :: ${request.failure()?.errorText ?? 'unknown error'}`);
  });

  fixture.page.on('response', response => {
    if (response.status() >= 400) {
      console.warn(`[Network] HTTP ${response.status()} ${response.request().method()} ${response.url()}`);
    }
  });

  fixture.page.on('console', message => {
    if (message.type() === 'error' || message.type() === 'warning') {
      console.warn(`[Browser console:${message.type()}] ${message.text()}`);
    }
  });
});

After(async ({ result }) => {
  if (fixture.page && !fixture.page.isClosed()) {
    const finalUrl = fixture.page.url();
    console.log(`[Page] Scenario finished. status=${result?.status ?? 'unknown'}, finalUrl=${finalUrl}`);

    try {
      console.log(`[Page] Final title: ${await fixture.page.title()}`);
    } catch (e) {
      console.warn(`[Page] Could not read final title: ${e}`);
    }

    if (result?.status === Status.FAILED) {
      const fileName = `${Date.now()}`;
      try {
        await fs.mkdir('reports/debug', { recursive: true });
        const html = await fixture.page.content();
        await fs.writeFile(`reports/debug/${fileName}.html`, html, 'utf8');
        await fs.writeFile(
          `reports/debug/${fileName}.txt`,
          [
            `BASE_URL=${process.env.BASE_URL ?? '<undefined>'}`,
            `FINAL_URL=${finalUrl}`,
            `TITLE=${await fixture.page.title()}`,
            `SEARCH_QUERY_COUNT=${await fixture.page.locator('#search-query').count()}`,
            `BODY_TEXT_PREVIEW=${(await fixture.page.locator('body').innerText()).slice(0, 4000)}`
          ].join('\n'),
          'utf8'
        );
        console.log(`[Debug] Failure HTML saved: reports/debug/${fileName}.html`);
        console.log(`[Debug] Failure summary saved: reports/debug/${fileName}.txt`);
      } catch (e) {
        console.warn(`[Debug] Could not save failure HTML/summary: ${e}`);
      }

      try {
        await ScreenshotHelper.capture(fixture.page, fileName);
        console.log(`[Debug] Failure screenshot saved: reports/screenshots/${fileName}.png`);
      } catch (e) {
        console.warn('Screenshot capture failed:', e);
      }
    }
  }

  await fixture.page?.close().catch(() => {});
  await context?.close().catch(() => {});
});

AfterAll(async () => {
  await browser?.close();
  console.log('[Browser] Chromium closed');
});
