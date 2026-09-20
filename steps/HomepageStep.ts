import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { Homepage } from '../pages/Homepage';
import { fixture } from '../Utils/fixture';
import { Properties } from '../properties/Properties';

Given('User navigated to home page url', async () => {
  await Homepage.navigateToHomePageUrl();
});

Then('User should be redirected to correct url', async function()  {
  const expectedPath = process.env.Base_URL;
  const actualUrl = fixture.page.url();
  expect(await actualUrl).toContain(expectedPath);
});

Given('User sorts the produclist alphabetically', async function(){
   await Homepage.sortAtoZ();
});

Then('User should be able to see the result alphabetically', async function(){
   await Homepage.productListingAtoZ();
});

When('User keeps the price slider max to {int}',async function(Maxnumber:number){
   await Homepage.setSliderPrice(Maxnumber);
});

Then('All the listed product should be below or equal to {int}', async function (Maxnumber:number) {
  await Homepage.verifyProductsPricing(Maxnumber);
});

When('User searches for {string} in Application',async function(keyword:string){
  await Homepage.searchOnHomePage(keyword);
});

Then('Homepage should display product with matching name {string}', async function(keyword:string){
  await Homepage.productListWithSearchKeyword(keyword);
});