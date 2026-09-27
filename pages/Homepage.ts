import { expect } from '@playwright/test';
import { fixture } from '../Utils/fixture';
import { Base } from '../Utils/Base';

export class Homepage extends Base {
  private static elements = {
    sortOptions: 'select[aria-label="sort"]',
    searchBox: '#search-query',
    slider: '.ngx-slider-pointer-max',
    powerTools: '//input[@class="icheck"]/parent::label[contains(text(),"Power")]',
    productListWithName: 'div.card-body h5',
    productListWithPrice: '[data-test="product-price"]',
    searchBtn: '[data-test="search-submit"]',
  };

  public static async navigateToHomePageUrl() {
    const url = process.env.BASE_URL;
    if (!url) {
      throw new Error('Environment variable Base_URL is not defined');
    }
    await fixture.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  public static async sortAtoZ() {
    const sort = fixture.page.locator(this.elements.sortOptions);
    await expect(sort).toBeVisible({ timeout: 30000 });
    await sort.selectOption({ label: 'Name (A - Z)' });
    await expect(sort).toHaveValue(/name,asc/i);
  }

  public static async productListingAtoZ(){
    await fixture.page.waitForLoadState('domcontentloaded');
     const productNames = fixture.page.locator(this.elements.productListWithName);
     await expect.poll(async () => {
       const productList = await productNames.allTextContents();
       const actual = productList.map(name => name.trim());
       return actual.every((name, index) =>
         index === 0 || actual[index - 1].localeCompare(name, undefined, { sensitivity: 'base' }) <= 0
       );
     }).toBe(true);
  }

  public static async productListWithSearchKeyword(keyword: string) {
    const list = fixture.page.locator(this.elements.productListWithName);
    await expect(list.first()).toBeVisible({ timeout: 30000 });
    await expect(list.first()).toContainText(keyword, { timeout: 30000 });
  }

  public static async setSliderPrice(number: number) {
    const slider = fixture.page.locator(this.elements.slider);
    await expect(slider).toBeVisible({ timeout: 30000 });
    await slider.focus();
    for (let i = 0; i < number; i++) {
      await slider.press('ArrowLeft');
    }
    await slider.press('Tab');
  }

  public static async verifyProductsPricing(targetValue: number) {
    const prices = await fixture.page.locator(this.elements.productListWithPrice).allTextContents();
    const actual = prices.map((price) => Number(price.replace('$', '').trim()));
    expect(actual.every((price) => price <= targetValue)).toBeTruthy();
  }

  public static async searchOnHomePage(keyword: string) {
    const searchBox = fixture.page.locator(this.elements.searchBox);
    await expect(searchBox).toBeVisible({ timeout: 30000 });
    await searchBox.fill(keyword);
    await fixture.page.locator(this.elements.searchBtn).click();
  }

  public static async categorySelection() {
    await fixture.page.reload({ waitUntil: 'domcontentloaded' });
    const powerTools = fixture.page.locator(this.elements.powerTools);
    await expect(powerTools).toBeVisible({ timeout: 30000 });
    await powerTools.check();
  }
}
