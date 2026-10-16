// @ts-check
import { chromium, defineConfig, devices } from '@playwright/test';


/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.js',
  reporter: 'html',
  retries: 1,
  timeout: 30 * 1000, // Test timeout: 30 seconds

  expect: {
    timeout: 30 * 1000, // Assertion timeout: 30 seconds
  },

  use: {
    browserName: 'chromium',
    headless: false,

    screenshot: 'on',
    trace: 'on',
    video: 'retain-on-failure',
  },
});
