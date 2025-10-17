const { devices } = require("@playwright/test");

module.exports = {
  testDir: "./tests",
  use: {
    headless: true,
    viewport: { width: 390, height: 844 },
    ignoreHTTPSErrors: true,
    baseURL: "http://localhost:3002",
  },
  projects: [{ name: "webkit", use: { ...devices["iPhone 13"] } }],
};
