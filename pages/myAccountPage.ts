import { expect } from '@playwright/test';
import { fixture } from '../Utils/fixture';
import { Base } from '../Utils/Base';

export class MyAccountPage extends Base {
  private static elements = {
    loginButton: '.nav-link[data-test="nav-sign-in"]',
    logingSubmitButton: '[data-test="login-submit"]',
    emailField: 'input#email',
    passwordField: 'input#password',
    welcomeText: "(//div[@class='container'])[3]//p",
  };

  public static async clickOnSignInButton() {
    const loginButton = fixture.page.locator(this.elements.loginButton);
    await expect(loginButton).toBeVisible({ timeout: 30000 });
    await loginButton.click({ timeout: 30000 });
    await expect(fixture.page).toHaveURL(/\/auth\/login/, { timeout: 30000 });
  }

  public static async userLogin(username: string, password: string) {
    const email = fixture.page.locator(this.elements.emailField);
    const pass = fixture.page.locator(this.elements.passwordField);
    await expect(email).toBeVisible({ timeout: 30000 });
    await email.fill(username);
    await pass.fill(password);
    await fixture.page.locator(this.elements.logingSubmitButton).click({ timeout: 30000 });
    await expect(fixture.page).not.toHaveURL(/\/auth\/login/, { timeout: 30000 });
  }

  public static async verifyWelcomeText(welcomeText: string) {
    await expect(fixture.page).toHaveURL(/\/account/, { timeout: 30000 });
    const text = fixture.page.getByText(welcomeText, { exact: false });
    await expect(text.first()).toBeVisible({ timeout: 30000 });
    await expect(text.first()).toContainText(welcomeText, { timeout: 30000 });
  }
}
