import {
  expect,
  test,
  type Page,
  type PageScreenshotOptions,
  type TestInfo,
} from "@playwright/test";

type ScreenshotOptions = Omit<PageScreenshotOptions, "path">;

function getUrl(path: string) {
  return new URL(path, "http://localhost:3000");
}

const expectedUrl = getUrl("/en");

test("HEADERS - expect to have cache headers", async ({ page }, testInfo) => {
  const startUrl = new URL(expectedUrl.toString());
  const res = (await page.goto(startUrl.toString()))!;
  await page.waitForTimeout(500);
  const headers = res?.headers() || {};
  const cacheControl = headers["cache-control"];

  // Cache Control
  expect(cacheControl).not.toContain("private");
  expect(cacheControl).toContain("s-maxage=");
  expect(cacheControl).toContain("stale-while-revalidate=");
});
