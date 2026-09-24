import { setDefaultTimeout } from '@cucumber/cucumber';
import { BrowserContext, Browser } from '@playwright/test';
import { fixture } from '../Utils/fixture';
import data from '../data/data.json';

setDefaultTimeout(180000);

export let browser: Browser;
export let context: BrowserContext;

export class Base {

     static async landOn(url: string) {
        await fixture.page.goto(url, {
            waitUntil: "domcontentloaded"
        });
    }

    static async waitAndClick(locator: string, timeout: number = 180000) {
        const element = fixture.page.locator(locator);
        await element.waitFor({
            state: "visible",
            timeout
        });
        await element.click({ timeout });
    }
    
    static async waitForVisibilty(locator: string, timeout: number=30000){
      const element = fixture.page.locator(locator);
      await element.waitFor({state: 'visible',timeout:timeout});
    }
    static async navigateTo(link: string) {
        await Promise.all([
            fixture.page.waitForNavigation(),
            fixture.page.click(link)
        ])
    }

    static async getTitle() {
        return await fixture.page.title();
    }

    static async getText(xpath: string) {
        return await fixture.page.locator(xpath).textContent();
    }

    static async fillField(xpath: string, value: string) {
        await fixture.page.locator(xpath).fill(value);
        console.log(`Filled field with selector ${xpath} with value ${value}`);
    }

    static async getCurrentUrl() {
        const url = await fixture.page.url();
        console.log(`Current URL is ${url}`);
        return url;
    }

    static async getLocatorByXPath(xpath: string) {
        const loc = await fixture.page.locator(xpath);
        console.log(`Locator for XPath ${xpath} obtained`);
        return loc;
    }

    static async pressKeyboardKeys(keysToEnter: string) {
        await Promise.all([
            await fixture.page.keyboard.press(keysToEnter)
        ])
    }

    static async generateEmailAddress() {
        const suffix = new Date().getTime();
        return `vivek+${suffix}@yopmail.com`;
        

    }

    static async generateEmailAddressWithParameters(prefix: string, subfix: string) {
        const timestamp = new Date().getTime();
        return prefix + `${timestamp}@` + subfix; //companyAutoTestAccount, gmail.com
    }

    static async getJsonValue(path: string): Promise<string>{
       return path.split('.').reduce((obj: any, key) => obj?.[key], data);
    }

  
}