// steps/hooks.ts
import { Before, After, BeforeAll, AfterAll, setDefaultTimeout, Status } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext } from '@playwright/test';
import { ScreenshotHelper } from '../Utils/ScreenshotHelper';
import { fixture } from '../Utils/fixture';

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
    console.log(`[Page] Scenario finished. status=${result?.status ?? 'unknown'}, finalUrl=${fixture.page.url()}`);
    try {
      console.log(`[Page] Final title: ${await fixture.page.title()}`);
    } catch (e) {
      console.warn(`[Page] Could not read final title: ${e}`);
    }
  }

  if (result?.status === Status.FAILED && fixture.page && !fixture.page.isClosed()) {
    try {
      const fileName = `${Date.now()}`;
      await ScreenshotHelper.capture(fixture.page, fileName);
      console.log(`[Debug] Failure screenshot saved: reports/screenshots/${fileName}.png`);
    } catch (e) {
      console.warn('Screenshot capture failed:', e);
    }
  }

  await fixture.page?.close().catch(() => {});
  await context?.close().catch(() => {});
});

AfterAll(async () => {
  await browser?.close();
  console.log('[Browser] Chromium closed');
});
