import {Base} from '../Utils/Base';
import { fixture } from '../Utils/fixture';
import { config } from 'dotenv';
import { expect, Page } from '@playwright/test';


export class Homepage extends Base {  

   private static elements = {
     sortOptions : 'select.form-select',
     productListWithName : 'div.card-body h5', 
     slider: '.ngx-slider-pointer-max',
     productListWithPrice : '[data-test="product-price"]'
   }

  public static async navigateToHomePageUrl() {
    const url = process.env.Base_URL;
    if (!url) {
      throw new Error('Environment variable Base_URL is not defined');
    }
    await this.landOn(url);
  }

  public static async sortAtoZ(){
     await fixture.page.locator(this.elements.sortOptions).selectOption({'value' : 'name,asc'});
  }

  public static async productListingAtoZ(){
    await fixture.page.waitForLoadState('networkidle');
     const produclist = await fixture.page.locator(this.elements.productListWithName).allTextContents();
     const actual = produclist.map(name => name.trim());
     const expected = [...actual].sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: 'base' })
    );
    expect(actual).toEqual(expected);
  }

  public static async setSliderPrice(number:number){
   const slider = fixture.page.locator(this.elements.slider);
   await slider.focus();     
  const targetValue = number;
  for (let i = 0; i < targetValue; i++) { 
  await slider.press('ArrowLeft');
  }
  }

  public static async verifyProductsPricing(targetValue : number){
    await fixture.page.waitForLoadState('networkidle');
    const produclist = await fixture.page.locator(this.elements.productListWithPrice).allTextContents();
    const actual = produclist.map(price => Number(price.replace('$',"").trim()));
  expect(actual.every(price => price <= targetValue)).toBeTruthy();
  }
}