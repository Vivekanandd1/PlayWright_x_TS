import { expect, test } from '@playwright/test';

const baseUrl = 'https://automationpractice.techwithjatin.com';
const email = 'vatsal@yopmail.com';

test('registers an account on Automation Practice', async ({ page }) => {
  await page.goto(`${baseUrl}/login?back=my-account`);
  await page.locator('#email_create').fill(email);
  await page.locator('#SubmitCreate').click();

  const accountForm = page.locator('#account-creation_form');
  const duplicateEmailError = page.locator('#create_account_error');
  await expect(accountForm.or(duplicateEmailError)).toBeVisible();

  if (await duplicateEmailError.isVisible()) {
    await expect(duplicateEmailError).toContainText('already been registered');
    return;
  }

  const password = process.env.REGISTRATION_PASSWORD;
  if (!password) {
    throw new Error('Set REGISTRATION_PASSWORD to create a new account.');
  }

  await page.locator('#id_gender1').check();
  await page.locator('#customer_firstname').fill('Vatsal');
  await page.locator('#customer_lastname').fill('Shah');
  await expect(page.locator('#email')).toHaveValue(email);
  await page.locator('#passwd').fill(password);
  await page.locator('#days').selectOption('1');
  await page.locator('#months').selectOption('1');
  await page.locator('#years').selectOption('1995');
  await page.locator('#submitAccount').click();

  await expect(page.getByText('Your account has been created.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Vatsal Shah' })).toBeVisible();
});
