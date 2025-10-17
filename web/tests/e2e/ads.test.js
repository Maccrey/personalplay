import { test, expect } from "@playwright/test";

test.describe("Ad Integration", () => {
  // 각 테스트 실행 전에 광고 스크립트 초기화
  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    await page.evaluate(() => {
      const loadScript = (src) => {
        return new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = src;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      };

      return Promise.all([
        loadScript("https://securepubads.g.doubleclick.net/tag/js/gpt.js"),
        loadScript(
          "https://cdn.jsdelivr.net/npm/prebid.js@latest/dist/prebid.js"
        ),
      ]).then(
        () =>
          new Promise((resolve) => {
            const checkInit = setInterval(() => {
              console.log("Checking initialization...");

              if (
                typeof window.googletag?.cmd !== "undefined" &&
                typeof window.pbjs?.que !== "undefined"
              ) {
                window.googletag.cmd.push(() => {
                  console.log("Initializing GPT...");
                  window.googletag.pubads().enableSingleRequest();
                  window.googletag.enableServices();
                  console.log("GPT initialized");
                });

                window.pbjs.que.push(() => {
                  console.log("Initializing Prebid...");
                  window.pbjs.setConfig({
                    bidderTimeout: 1000,
                    publisherDomain: window.location.origin,
                  });
                  console.log("Prebid initialized");
                });

                console.log("Ad scripts initialized");
                window.adsInitialized = true;
                clearInterval(checkInit);
                resolve();
              }
            }, 100);
          })
      );
    });
  });

  test("verify ad initialization", async ({ page }) => {
    const status = await page.evaluate(() => ({
      googletag: typeof window.googletag !== "undefined",
      gptCmd: Array.isArray(window.googletag?.cmd),
      pbjs: typeof window.pbjs !== "undefined",
      pbjsQue: Array.isArray(window.pbjs?.que),
      initialized: window.adsInitialized === true,
    }));

    console.log("Ad initialization status:", status);

    expect(status.googletag).toBe(true);
    expect(status.gptCmd).toBe(true);
    expect(status.pbjs).toBe(true);
    expect(status.pbjsQue).toBe(true);
    expect(status.initialized).toBe(true);
  });
});
