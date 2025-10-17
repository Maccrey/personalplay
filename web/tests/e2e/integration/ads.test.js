import { test, expect } from '@playwright/test';

test.describe('Ad Integration', () => {
  test.setTimeout(120000);

  // 각 테스트 실행 전에 광고 스크립트 초기화
  test.beforeEach(async ({ page }) => {
    // 콘솔 로그 캡처
    page.on('console', msg => {
      console.log(`Browser log: ${msg.text()}`);
    });

    await page.goto('/');

    // 스크립트 로드
    await Promise.all([
      page.addScriptTag({ 
        url: 'https://securepubads.g.doubleclick.net/tag/js/gpt.js',
        type: 'text/javascript' 
      }),
      page.addScriptTag({ 
        url: 'https://cdn.jsdelivr.net/npm/prebid.js@latest/dist/prebid.js',
        type: 'text/javascript'
      })
    ]);

    // 초기화 대기
    await page.evaluate(() => {
      console.log('Starting ad initialization...');
      return new Promise((resolve) => {
        const startTime = Date.now();
        const checkInit = setInterval(() => {
          const elapsed = Date.now() - startTime;
          console.log(`Checking initialization (${elapsed}ms):`, {
            googletag: typeof window.googletag !== 'undefined',
            gptCmd: typeof window.googletag?.cmd !== 'undefined',
            pbjs: typeof window.pbjs !== 'undefined',
            pbjsQue: typeof window.pbjs?.que !== 'undefined'
          });
          
          if (typeof window.googletag?.cmd !== 'undefined' && 
              typeof window.pbjs?.que !== 'undefined') {
            
            window.googletag.cmd.push(() => {
              console.log('Initializing GPT...');
              window.googletag.pubads().enableSingleRequest();
              window.googletag.enableServices();
              console.log('GPT initialized');
            });

            window.pbjs.que.push(() => {
              console.log('Initializing Prebid...');
              window.pbjs.setConfig({
                bidderTimeout: 1000,
                publisherDomain: window.location.origin
              });
              console.log('Prebid initialized');
            });

            console.log('Ad scripts initialized');
            window.adsInitialized = true;
            clearInterval(checkInit);
            resolve();
          }

          // 30초 후 타임아웃
          if (elapsed > 30000) {
            console.error('Ad initialization timeout');
            clearInterval(checkInit);
            resolve();
          }
        }, 100);
      });
    });
  });

  test('verify ad initialization', async ({ page }) => {
    console.log('Starting verification...');

    // 상태 체크를 위한 타임아웃 설정
    const maxAttempts = 50;
    let attempts = 0;
    let status;

    while (attempts < maxAttempts) {
      status = await page.evaluate(() => ({
        googletag: typeof window.googletag !== 'undefined',
        gptCmd: Array.isArray(window.googletag?.cmd),
        pbjs: typeof window.pbjs !== 'undefined',
        pbjsQue: Array.isArray(window.pbjs?.que),
        initialized: window.adsInitialized === true
      }));

      console.log(`Verification attempt ${attempts + 1}:`, status);

      if (status.googletag && status.gptCmd && status.pbjs && status.pbjsQue && status.initialized) {
        break;
      }

      await page.waitForTimeout(100);
      attempts++;
    }

    expect(status.googletag).toBe(true);
    expect(status.gptCmd).toBe(true);
    expect(status.pbjs).toBe(true);
    expect(status.pbjsQue).toBe(true);
    expect(status.initialized).toBe(true);
  });
});