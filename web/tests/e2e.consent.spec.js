import { test, expect } from "@playwright/test";

test("Consent flow: deny hides ads", async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 900 });
  // 페이지 로드 전에 localStorage 초기화
  await page.addInitScript(() => localStorage.removeItem("pp_consent"));
  await page.goto("http://localhost:3002/result/1?r=A", {
    waitUntil: "domcontentloaded",
  });

  // 배너 보임 및 거부 선택
  await expect(page.locator("role=dialog")).toBeVisible();
  await page.locator('button:has-text("거부")').click();
  await page.waitForTimeout(200);
  // 첫 번째 ads-disabled가 보여야 함
  await expect(page.locator(".ads-disabled").first()).toBeVisible();
});

test("Consent flow: agree shows ads", async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 900 });
  // 페이지 로드 전에 localStorage 초기화
  await page.addInitScript(() => localStorage.removeItem("pp_consent"));
  await page.goto("http://localhost:3002/result/1?r=A", {
    waitUntil: "domcontentloaded",
  });

  // 배너 보임 및 동의 선택
  await expect(page.locator("role=dialog")).toBeVisible();
  await page.locator('button:has-text("동의")').click();
  await page.waitForTimeout(200);
  // adsbygoogle 요소가 존재하고 테스트 속성 data-ad-visible="true"가 붙어 있어야 함
  const ad = page.locator('ins.adsbygoogle[data-ad-visible="true"]').first();
  await expect(ad).toHaveAttribute("data-ad-visible", "true", {
    timeout: 5000,
  });
});
