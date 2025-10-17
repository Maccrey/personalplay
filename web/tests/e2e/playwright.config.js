// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 120000,
  expect: {
    timeout: 30000,
  },
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'Ad Integration Tests',
      testDir: './tests/e2e',
      use: {
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
      },
      timeout: 120000,
    },
  ],
});