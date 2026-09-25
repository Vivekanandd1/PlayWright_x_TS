// steps/hooks.ts
import { Before, After, BeforeAll, AfterAll, setDefaultTimeout, Status } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext } from '@playwright/test';
import { ScreenshotHelper } from '../Utils/ScreenshotHelper';
import { fixture } from '../Utils/fixture';

setDefaultTimeout(180000);

let browser: Browser;
let context: BrowserContext;

BeforeAll(async () => {
  browser = await chromium.launch({ headless: !! process.env.CI });
});

Before(async () => {
  context = await browser.newContext();
  fixture.page = await context.newPage();
  fixture.page.setDefaultTimeout(180000);
  fixture.page.setDefaultNavigationTimeout(180000);
});

After(async ({ result }) => {
  if (result?.status === Status.FAILED && fixture.page && !fixture.page.isClosed()) {
    try {
      const fileName = `${Date.now()}`;
      await ScreenshotHelper.capture(fixture.page, fileName);
    } catch (e) {
      console.warn('Screenshot capture failed:', e);
    }
  }

  await fixture.page?.close().catch(() => {});
  await context?.close().catch(() => {});
});

AfterAll(async () => {
  await browser?.close();
});
