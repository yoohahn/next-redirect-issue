// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

const IS_CI = process.env.CI === "true";
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: IS_CI,
  retries: IS_CI ? 2 : 0,
  workers: IS_CI ? 1 : undefined,
  reporter: [["html", { open: IS_CI ? "never" : "on-failure" }]],
  use: {
    testIdAttribute: "data-test-id",
    trace: "on-first-retry",
    ignoreHTTPSErrors: true,
    video: {
      mode: IS_CI ? "retain-on-failure" : "on",
    },
    screenshot: IS_CI ? "only-on-failure" : "on",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
});
