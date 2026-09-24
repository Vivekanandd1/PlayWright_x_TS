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
        await fixture.page.waitForLoadState('domcontentloaded');
        await this.waitForVisibilty(this.elements.loginButton, 180000)
        await this.waitAndClick(this.elements.loginButton);
        await fixture.page.waitForURL('**/auth/login**', { timeout: 180000 });
    }
   
    public static async userLogin(username: string, password: string){
        await this.waitForVisibilty(this.elements.emailField, 180000);
        await fixture.page.locator(this.elements.emailField).fill(username);
        await fixture.page.locator(this.elements.passwordField).fill(password);
        await this.waitAndClick(this.elements.logingSubmitButton);
        await fixture.page.waitForURL((url) => !url.pathname.includes('/auth/login'), { timeout: 180000 });
    }

    public static async verifyWelcomeText(welcomeText:string){
        await fixture.page.waitForURL('**/account**', { timeout: 180000 });
        await fixture.page.waitForLoadState('domcontentloaded');
        const text = fixture.page.getByText(welcomeText, { exact: false });
        await text.first().waitFor({ state: 'visible', timeout: 180000 });
        expect(await text.first().textContent()).toContain(welcomeText);
    }

}
