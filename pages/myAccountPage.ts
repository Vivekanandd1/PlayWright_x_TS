import { expect, Page } from '@playwright/test';
import { fixture } from '../Utils/fixture';
import { config } from 'dotenv';
import { Base } from '../Utils/Base';

export class MyAccountPage extends Base {
     private static elements = {
      //Buttons
      loginButton: '.nav-link[data-test="nav-sign-in"]',
      logingSubmitButton: '[data-test="login-submit"]',

      //Fields
      emailField: 'input#email',
      passwordField: 'input#password',

      //Text
      welcomeText: "(//div[@class='container'])[3]//p"

    }

    public static async clickOnSignInButton() {
        await fixture.page.waitForLoadState('networkidle');
        await this.waitForVisibilty(this.elements.loginButton, 60000)
        await this.waitAndClick(this.elements.loginButton);
    }
   
    public static async userLogin(username: string, password: string){
        await fixture.page.locator(this.elements.emailField).fill(username);
        await fixture.page.locator(this.elements.passwordField).fill(password);
        await this.waitAndClick(this.elements.logingSubmitButton);
    }

    public static async verifyWelcomeText(welcomeText:string){
        await fixture.page.waitForLoadState('networkidle');
        const text = fixture.page.locator(this.elements.welcomeText);
        expect(await text.textContent()).toContain(welcomeText);
    }

}
