import {
  expect,
  test,
  type Page,
  type PageScreenshotOptions,
  type TestInfo,
} from "@playwright/test";

type ScreenshotOptions = Omit<PageScreenshotOptions, "path">;

export async function takeScreenshot(
  //
  testInfo: TestInfo,
  page: Page,
  options: ScreenshotOptions,
  filenamePrefix = "",
) {
  const browserName = testInfo.project.name.toLowerCase();
  const screenshotFileName = `${testInfo.title.replace(/\s+/g, "-").toLowerCase()}${filenamePrefix ? `-${filenamePrefix}` : ""}--${browserName}.png`;
  await page.screenshot({
    //
    fullPage: false,
    path: `e2e/screenshots/${screenshotFileName}`,
    ...options,
  });
}

function getUrl(path: string) {
  return new URL(path, "http://localhost:3000");
}

const expectedUrl = getUrl("/en/foo");
const redirectUrl = getUrl("/en/foo/redirect");

test("REDIRECT - handle direct redirects", async ({ page }, testInfo) => {
  let locationHeader = expectedUrl.toString();
  page.on("response", async (response) => {
    // Check if this response is for the initial URL and has a redirect status
    // Or if it's the specific redirect response you are interested in
    if (response.status() >= 300 && response.status() < 400) {
      // This will fail in OpenNext
      // Not sure how it will look like in NextJS. But in the response headeres in the browser we have two Location headers.
      // And that is not valid HTTP to send multiple Location headers.
      locationHeader = response.headers()["location"] || "";
    }
  });
  await page.goto(redirectUrl.toString());
  await takeScreenshot(testInfo, page, {}, "1");
  const finalUrl = page.url();

  if (process.env.OPEN_NEXT === "true") {
    /*
     * If running the opennext locally I only get this to fail first run. Then it works as expected.
     * But in prod we get the error all the time.
     *
     * So locally remove the open-next and wrangler build cache and start preview again to see the error
     */
  }
  expect(finalUrl).toBe(expectedUrl.toString());
  expect(locationHeader).toBe(finalUrl);
});

test("REDIRECT - handle redirect from parent nav", async ({
  page,
}, testInfo) => {
  const startUrl = new URL(expectedUrl.toString());
  await page.goto(startUrl.toString());
  await takeScreenshot(testInfo, page, {}, "1");
  await page.goto(redirectUrl.toString());
  await takeScreenshot(testInfo, page, {}, "2");
  const browserUrl = page.url();
  expect(browserUrl).toBe(expectedUrl.toString());
});
