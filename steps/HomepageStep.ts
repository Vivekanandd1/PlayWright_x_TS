import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { Homepage } from '../pages/Homepage';
import { fixture } from '../Utils/fixture';
import { Properties } from '../properties/Properties';

Given('User navigated to home page url', async () => {
  await Homepage.navigateToHomePageUrl();
});

Then('User should be redirected to correct url', async function()  {
  const expectedPath = process.env.BASE_URL;
  const actualUrl = fixture.page.url();
  expect(await actualUrl).toContain(expectedPath);
});

Given('the store logo, search box, cart summary and {string} link are displayed', async function(navLink: string){
   await Homepage.pageLayout(navLink);
});

Then('the main navigation shows {string}, {string} and {string}', async function(product1:string,product2:string,product3:string){
   await Homepage.productCategory(product1,product2,product3);
});

When('the home slider is displayed with its promotional slides',async function(){
   await Homepage.heroBannerVisibilty();
});

Then('the {string} call to action is visible on the active slide', async function (message:string) {
  await Homepage.textVerification(message);
});

When('the user selects the {string} tab',async function(tab:string){
  await Homepage.tabSelection(tab);
});

Then('a list of products is displayed in the {string} section', async function(tab:string){
  await Homepage.productListFromTabSelection(tab);
});

When('each product shows its name, price and stock status', async function() {
   await Homepage.productDetails();
});

// Then('User should be able to see the related product {string}', async function(tools:string){
//    await Homepage.productListWithSearchKeyword(Properties.getProperty(tools));
// });
