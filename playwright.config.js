// @ts-check
import { chromium, defineConfig, devices } from '@playwright/test';


/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

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

