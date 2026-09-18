import { Given, Then } from '@cucumber/cucumber';
import data from '../data/data.json';
import { MyAccountPage } from '../pages/myAccountPage';
import dotenv from 'dotenv';
dotenv.config();
import { Properties } from '../properties/Properties';

const username = process.env.email;
const password = process.env.password;

if (!username || !password) {
  throw new Error('UserName or Password is missing from .env');
}

Given ('User clicked on SignIn button', async function()  {
  await MyAccountPage.clickOnSignInButton();
});

Given ('User entered valid username and password', async function(){
    await MyAccountPage.userLogin(username,password);
});

Then('User should be able to see the welcome text {string} on the account page', async function (welcomeTextPath:string) {
    // const welcomeText = 
    await MyAccountPage.verifyWelcomeText(Properties.getProperty(welcomeTextPath));
});