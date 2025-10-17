import { test, expect } from "@playwright/test";

test.describe("Ad Integration Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test/1");
  });

  test.setTimeout(60000); // 테스트 시간 늘림

  test("should load all ad slots", async ({ page }) => {
    // 콘솔 로그 모니터링 설정
    page.on("console", (msg) => console.log(`Browser console: ${msg.text()}`));

    // 페이지 로드 및 스크립트 로드 대기
    await page.waitForLoadState("networkidle");

    // 광고 스크립트 로드 확인
    await page.waitForFunction(() => window.gptLoaded && window.prebidLoaded, {
      polling: 100,
      timeout: 20000,
    });

    // 서비스 초기화 대기 (pubadsReady 확인)
    await page.waitForFunction(() => window.googletag?.pubadsReady === true, {
      polling: 100,
      timeout: 20000,
    });

    // 모든 광고 컨테이너가 존재하는지 확인
    const adContainers = await page.locator(".ad-container").all();
    expect(adContainers.length).toBe(4); // 상단, 사이드바, 본문 내, 하단

    // GPT 스크립트가 로드되었는지 확인
    const gptScript = await page.locator(
      'script[src*="doubleclick.net/tag/js/gpt.js"]'
    );
    await expect(gptScript).toBeAttached();

    // Prebid.js 스크립트가 로드되었는지 확인
    const prebidScript = await page.locator('script[src*="prebid.js"]');
    await expect(prebidScript).toBeAttached();
  });

  test("should track ad metrics", async ({ page }) => {
    // GA4 이벤트 추적 확인을 위한 인터셉터 설정
    let trackedEvents = [];
    await page.route("**/collect*", async (route) => {
      const url = route.request().url();
      if (url.includes("ad_bid")) {
        trackedEvents.push(url);
      }
      await route.continue();
    });

    // 페이지 리로드하여 광고 로드 트리거
    await page.reload();

    // 광고 스크립트와 서비스 초기화 대기
    await page.waitForFunction(() => window.gptLoaded && window.prebidLoaded, {
      polling: 100,
      timeout: 20000,
    });

    // 서비스 초기화 대기
    await page.waitForFunction(() => window.googletag?.pubadsReady === true, {
      polling: 100,
      timeout: 20000,
    });

    // 광고 요청이 완료될 때까지 대기
    await page.waitForTimeout(5000);
    expect(trackedEvents.length).toBeGreaterThan(0);
  });
});
