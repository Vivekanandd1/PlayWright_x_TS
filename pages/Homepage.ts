import { expect } from '@playwright/test';
import { fixture } from '../Utils/fixture';
import { Base } from '../Utils/Base';

export class Homepage extends Base {
  private static elements = {
    // Select options
    sortOptions: '//select[@aria-label="sort"]',

    // Fields
    searchBox: '#search_query_top',
    slider: 'div#homepage-slider',
    powerTools: '//input[@class="icheck"]/parent::label[contains(text(),"Power")]',

    // Product elements
    productListWithName: 'div.card-body h5',
    productListWithPrice: '[data-test="product-price"]',

    // Buttons and static elements
    searchBtn: '[data-test="search-submit"]',
    logo: '#header_logo',
    cart: 'div.shopping_cart a',
  };

  public static async navigateToHomePageUrl() {
    const url = process.env.BASE_URL;
    if (!url) {
      throw new Error('Environment variable BASE_URL is not defined');
    }

    // Do not print the secret value itself: GitHub Actions masks secrets in logs.
    const configuredUrl = new URL(url);
    console.log(`[Homepage] Navigating to host=${configuredUrl.host}, path=${configuredUrl.pathname || '/'}`);

    await fixture.page.goto(url, { waitUntil: 'domcontentloaded' });
    console.log(`[Homepage] URL after goto: ${fixture.page.url()}`);
    console.log(`[Homepage] Title after goto: ${await fixture.page.title()}`);

    const pageTitle = await fixture.page.title();
    if (pageTitle.toLowerCase().includes('just a moment') ||
        pageTitle.toLowerCase().includes('attention required')) {
      throw new Error(
        `Cloudflare/security challenge detected. ` +
        `Final URL: ${fixture.page.url()}, title: ${pageTitle}. ` +
        'The CI runner was blocked before the application homepage loaded.'
      );
    }

    await expect(fixture.page).toHaveURL('https://automationpractice.techwithjatin.com/', {
      timeout: 30000,
    });
    await expect(fixture.page.locator('#search_query_top')).toBeVisible({ timeout: 30000 });
  }

  public static async pageLayout(navLink:string) {
    const logo = fixture.page.locator(this.elements.logo);
    const searchBox = fixture.page.locator(this.elements.searchBox);
    const cart = fixture.page.locator(this.elements.cart).first();
    await expect(logo).toBeVisible();
    await expect(searchBox).toBeVisible();
    await expect(cart).toBeVisible();
    await expect(fixture.page.locator(`//div[@class="header_user_info"]/a[normalize-space()="${navLink}"]`)).toBeVisible();
  }


  public static async productCategory(product1:string,product2:string,product3:string) {
    const productOne = fixture.page.locator(`//div[@id='block_top_menu']//li/a[@title="${product1}"]`);
    const productTwo = fixture.page.locator(`//div[@id='block_top_menu']//li/a[@title="${product2}"]`).last();
    const productThree = fixture.page.locator(`//div[@id='block_top_menu']//li/a[@title="${product3}"]`).last();

    await expect(productOne).toBeVisible();
    await expect(productTwo).toBeVisible();
    await expect(productThree).toBeVisible();
  }

  public static async productListWithSearchKeyword(keyword: string) {
    const list = fixture.page.locator(this.elements.productListWithName);
    await expect(list.first()).toBeVisible({ timeout: 30000 });
    await expect(list.first()).toContainText(keyword, { timeout: 30000 });
  }

  public static async heroBannerVisibilty() {
    const slider = fixture.page.locator(this.elements.slider);
    await expect(slider).toBeVisible({ timeout: 30000 });
  }

  public static async textVerification(message: string) {
    const text = fixture.page.locator(`//div[@id='homepage-slider']//button[normalize-space()="${message}"]`).last();
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
