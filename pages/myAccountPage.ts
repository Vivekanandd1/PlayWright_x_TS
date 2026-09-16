import { expect, Page } from '@playwright/test';
import { fixture } from '../Utils/fixture';
import { config } from 'dotenv';
import { Base } from '../Utils/Base';

export class MyAccountPage extends Base {
     private static elements = {
      //Buttons
      loginButton: 'a[data-test="nav-sign-in"]',
      logingSubmitButton: '[data-test="login-submit"]',

      //Fields
      emailField: 'input#email',
      passwordField: 'input#password',

      //Text
      welcomeText: "(//div[@class='container'])[3]//p"

    }

    public static async clickOnSignInButton() {
        await this.waitAndClick(this.elements.loginButton);
    }
   
    public static async userLogin(username: string, password: string){
        await fixture.page.locator(this.elements.emailField).fill(username);
        await fixture.page.locator(this.elements.passwordField).fill(password);
        await this.waitAndClick(this.elements.logingSubmitButton);
        await fixture.page.pause();
    }

    public static async verifyWelcomeText(welcomeText:string){
        const text = fixture.page.locator(this.elements.welcomeText);
        await text.waitFor({state: "visible",timeout: 2000});
        expect(await text.textContent()).toContain(welcomeText);
    }

}