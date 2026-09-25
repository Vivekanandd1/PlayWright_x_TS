// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import { config as loadEnv } from 'dotenv';
import path from 'path';

loadEnv({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 1,
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    trace: 'on-first-retry',
    baseURL: process.env.Base_URL
  },
});
