import {Base} from '../Utils/Base';
import { fixture } from '../Utils/fixture';
import { config } from 'dotenv';
import { expect, Page } from '@playwright/test';


export class Homepage extends Base {  

   private static elements = {
    //SelectsOptions
     sortOptions : '//select[@aria-label="sort"]',

     //Field
     searchBox : '#search-query',
     slider: '.ngx-slider-pointer-max',
     powerTools: '//input[@class="icheck"]/parent::label[contains(text(),"Power")]',

     //Porudcts element
     productListWithName : 'div.card-body h5', 
     productListWithPrice : '[data-test="product-price"]',

     //buttons
     searchBtn : '[data-test="search-submit"]',
   }

  public static async navigateToHomePageUrl() {
  const url = process.env.BASE_URL;
  if (!url) {
    throw new Error('Environment variable BASE_URL is not defined');
  }
  await fixture.page.goto(url, { waitUntil: 'domcontentloaded' });
  await expect(fixture.page).toHaveURL('https://practicesoftwaretesting.com/', {timeout: 30000});
  await expect(fixture.page.locator('#search-query')).toBeVisible({timeout: 30000 });
  }

  public static async sortAtoZ(){
     await fixture.page.waitForLoadState('domcontentloaded');
     await this.waitForVisibilty(this.elements.sortOptions, 180000)
     await fixture.page.locator(this.elements.sortOptions).selectOption({'value' : 'name,asc'});
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

   public static async productListWithSearchKeyword(keyword:string){
     await fixture.page.waitForTimeout(3000);
     await fixture.page.waitForLoadState('load');
     const produclist = await fixture.page.locator(this.elements.productListWithName).allTextContents();
    expect(produclist[1].trim()).toContain(keyword);
  }

  public static async setSliderPrice(number:number){
   const slider = fixture.page.locator(this.elements.slider);
   await slider.focus();     
  const targetValue = number;
  for (let i = 0; i < targetValue; i++) { 
  await slider.press('ArrowLeft');
  }
  await slider.press('Tab');
  }

  public static async verifyProductsPricing(targetValue : number){
    await fixture.page.waitForTimeout(3000);
    const produclist = await fixture.page.locator(this.elements.productListWithPrice).allTextContents();
    const actual = produclist.map(price => Number(price.replace('$',"").trim()));
  expect(actual.every(price => price <= targetValue)).toBeTruthy();
  }

  public static async searchOnHomePage(keyword:string){
    await fixture.page.waitForLoadState('domcontentloaded');
    await fixture.page.locator(this.elements.searchBox).fill(keyword);
    await fixture.page.locator(this.elements.searchBtn).click();
  }

  public static async categorySelection(){
    await fixture.page.reload({ waitUntil: 'domcontentloaded' });
    await this.waitForVisibilty(this.elements.powerTools, 180000);
    await fixture.page.locator(this.elements.powerTools).check();
  }
}
