import { BrowserContext, Browser } from '@playwright/test';
import { setDefaultTimeout } from '@cucumber/cucumber';

setDefaultTimeout(180000);

export let browser: Browser;
export let context: BrowserContext;

export class Base {
  static async landOn(page: any, url: string) {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  static async waitAndClick(page: any, locator: string, timeout = 30000) {
    await page.locator(locator).click({ timeout });
  }

  static async waitForVisibility(page: any, locator: string, timeout = 30000) {
    await page.locator(locator).waitFor({ state: 'visible', timeout });
  }
}
