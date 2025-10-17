import { test, expect } from "@playwright/test";

test.describe("Ad Integration", () => {
  test("scripts load correctly and GPT is initialized", async ({ page }) => {
    test.slow();

    // 페이지로 이동
    await page.goto("/");

    // 더 오래 기다리고 더 자주 체크
    await page.waitForFunction(
      () => {
        console.log("Checking initialization status:", {
          googletag: typeof window.googletag !== "undefined",
          pbjs: typeof window.pbjs !== "undefined",
          adsInitialized: window.adsInitialized === true,
        });
        return window.adsInitialized === true;
      },
      {
        timeout: 60000,
        polling: 1000,
      }
    );

    // GPT 초기화 확인
    const gptInitialized = await page.evaluate(() => {
      console.log("Checking GPT initialization:", {
        apiReady: window.googletag?.apiReady,
        pubadsReady: typeof window.googletag?.pubads === "function",
      });
      return (
        window.googletag &&
        window.googletag.apiReady &&
        typeof window.googletag.pubads === "function"
      );
    });

    expect(gptInitialized).toBe(true);

    // Prebid 초기화 확인
    const prebidInitialized = await page.evaluate(() => {
      console.log("Checking Prebid initialization:", {
        pbjs: typeof window.pbjs !== "undefined",
        que: Array.isArray(window.pbjs?.que),
        requestBids: typeof window.pbjs?.requestBids === "function",
      });
      return (
        window.pbjs &&
        Array.isArray(window.pbjs.que) &&
        typeof window.pbjs.requestBids === "function"
      );
    });

    expect(prebidInitialized).toBe(true);
  });

  test("ad slots are rendered", async ({ page }) => {
    await Promise.all([
      page.goto("/"),
      // 광고 초기화 대기
      page.waitForFunction(() => window.adsInitialized === true, {
        timeout: 30000,
        polling: 1000,
      }),
    ]);

    // 광고 슬롯이 페이지에 렌더링되었는지 확인
    const adSlot = await page.waitForSelector("#ad-slot-1", { timeout: 30000 });
    expect(adSlot).toBeTruthy();

    // GPT 광고 요청이 발생했는지 확인
    const gptRequested = await page.evaluate(() => {
      console.log("Checking GPT slots:", {
        slots: window.googletag?.pubads().getSlots().length,
        targeting: window.googletag?.pubads().getTargeting(),
      });
      return window.googletag.pubads().getSlots().length > 0;
    });

    expect(gptRequested).toBe(true);
  });
});
