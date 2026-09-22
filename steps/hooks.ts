import { Before, After, BeforeAll, AfterAll, setDefaultTimeout, Status } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext } from '@playwright/test';
import { ScreenshotHelper } from '../Utils/ScreenshotHelper';
import { fixture } from '../Utils/fixture';

setDefaultTimeout(180000);

let browser: Browser;
let context: BrowserContext;

BeforeAll(async () => {
  browser = await chromium.launch({ headless: !!process.env.CI });
});

Before(async () => {
  context = await browser.newContext();
  fixture.page = await context.newPage();
});

After(async ({ result }) => {
     if (result?.status === Status.FAILED) {
      const fileName = `${Date.now()}`;
      await ScreenshotHelper.capture(fixture.page, fileName);
    }

  await fixture.page?.close();
  await context?.close();

});

AfterAll(async () => {
  await browser?.close();
});
