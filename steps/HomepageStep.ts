import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { Homepage } from '../pages/Homepage';
import { fixture } from '../Utils/fixture';
import { Properties } from '../properties/Properties';

Given('User navigated to home page url', async () => {
  await Homepage.navigateToHomePageUrl();
});

Then('User should be redirected to {string} url', async (expectedPath: string) => {
  const expectedUrl = process.env.Base_URL;
  const actualUrl =await fixture.page.url();
  expect(await actualUrl).toContain(expectedUrl);
});