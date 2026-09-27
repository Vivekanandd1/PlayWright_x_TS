import { expect, Page } from '@playwright/test';
import { fixture } from '../Utils/fixture';
import { config } from 'dotenv';
import { Base } from '../Utils/Base';

export class MyAccountPage extends Base {
     private static elements = {
      //Buttons
      loginButton: '[routerlink="/auth/login"]',
      logingSubmitButton: '[data-test="login-submit"]',

      //Fields
      emailField: 'input#email',
      passwordField: 'input#password',

      //Text
      welcomeText: "(//div[@class='container'])[3]//p"

    }

   public static async clickOnSignInButton() {
    const loginButton = fixture.page.getByRole('link', { name: 'Sign in' }); 
    await expect(loginButton).toBeVisible({ timeout: 30000 });
    await loginButton.click();
    await expect(fixture.page).toHaveURL(/\/auth\/login/, { timeout: 30000,});
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
