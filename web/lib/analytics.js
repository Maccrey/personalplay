// Google Analytics 설정
// NEXT_PUBLIC_GA_ID가 없으면 Firebase Measurement ID 사용
export const GA_TRACKING_ID =
  process.env.NEXT_PUBLIC_GA_ID ||
  process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

// 페이지뷰 추적
export const pageview = (url) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// 이벤트 추적
export const event = ({ action, category, label, value }) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// 기존 utils/analytics.js의 trackEvent와 호환되는 함수
export const trackEvent = (eventName, payload = {}) => {
  if (typeof window !== 'undefined') {
    try {
      // dataLayer를 통한 추적
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: eventName,
        ...payload
      });

      // gtag를 통한 추적
      if (window.gtag) {
        window.gtag('event', eventName, payload);
      }

      console.log('[analytics] event', eventName, payload);
    } catch (e) {
      // Silent fail - analytics should not break the app
      console.error('[analytics] error', e);
    }
  }
};

// 특정 이벤트 헬퍼 함수들
export const trackTestStart = (testId, testName) => {
  trackEvent('test_start', {
    test_id: testId,
    test_name: testName,
    event_category: 'Test',
  });
};

export const trackTestComplete = (testId, testName, score, totalQuestions) => {
  trackEvent('test_complete', {
    test_id: testId,
    test_name: testName,
    score: score,
    total_questions: totalQuestions,
    event_category: 'Test',
  });
};

export const trackResultShare = (testId, platform) => {
  trackEvent('result_share', {
    test_id: testId,
    platform: platform,
    event_category: 'Share',
  });
};

export const trackCategoryView = (categoryId, categoryName) => {
  trackEvent('category_view', {
    category_id: categoryId,
    category_name: categoryName,
    event_category: 'Navigation',
  });
};

export const trackButtonClick = (buttonName, location) => {
  trackEvent('button_click', {
    button_name: buttonName,
    location: location,
    event_category: 'Engagement',
  });
};
